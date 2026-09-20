"""
Authentication router — backed by the SQLite `users` table.
Uses bcrypt directly (compatible with bcrypt >= 4.x) for password hashing.
"""

import uuid
import bcrypt
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database import get_db
from backend.models.db_models import User
from backend.models.schemas import LoginRequest, RegisterRequest, AuthResponse, UserProfile

router = APIRouter(prefix="/auth", tags=["Authentication"])

_TOKEN_PREFIX = "kg_auth_tok_"


def _hash_pw(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_pw(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _make_token(uid: str) -> str:
    return f"{_TOKEN_PREFIX}{uid}_{uuid.uuid4().hex[:16]}"


def _user_to_profile(user: User, token: str) -> dict:
    return {
        "id": user.uid,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "avatar": user.avatar or "",
        "department": user.department or "",
        "lastLogin": user.last_login.strftime("%Y-%m-%d %H:%M:%S UTC") if user.last_login else "",
        "token": token,
    }


@router.post("/login", response_model=AuthResponse)
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate a user with email + password."""
    if not credentials.email or not credentials.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email and password are required.")

    result = await db.execute(select(User).where(User.email == credentials.email))
    user: User | None = result.scalar_one_or_none()

    if user is None or not _verify_pw(credentials.password, user.hashed_pw):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid email or password.")

    user.last_login = datetime.now(timezone.utc)
    token = _make_token(user.uid)

    return {
        "success": True,
        "user": _user_to_profile(user, token),
        "token": token,
    }


@router.post("/register", response_model=AuthResponse)
async def register(userData: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    if not userData.email or not userData.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email and password are required.")

    existing = await db.execute(select(User).where(User.email == userData.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="An account with this email already exists.")

    uid = f"usr_{uuid.uuid4().hex[:8]}"
    new_user = User(
        uid=uid,
        name=userData.name or userData.fullName or "Enterprise User",
        email=userData.email,
        hashed_pw=_hash_pw(userData.password),
        role=userData.role or "Researcher",
        avatar="",
        department="",
        last_login=datetime.now(timezone.utc),
    )
    db.add(new_user)
    await db.flush()

    token = _make_token(uid)
    return {
        "success": True,
        "user": _user_to_profile(new_user, token),
        "token": token,
    }


@router.get("/me", response_model=UserProfile)
async def get_current_user(db: AsyncSession = Depends(get_db)):
    """Return the primary admin profile."""
    result = await db.execute(select(User).where(User.uid == "usr_01"))
    user: User | None = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    token = _make_token(user.uid)
    return _user_to_profile(user, token)
