"""
Documents router — CRUD operations backed by the SQLite `documents` table.
"""

import uuid
import time
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from backend.database import get_db
from backend.models.db_models import Document
from backend.models.schemas import DocumentItem, DocumentUploadResponse

router = APIRouter(prefix="/documents", tags=["Documents"])


def _doc_to_schema(d: Document) -> dict:
    return {
        "id": d.doc_id,
        "name": d.name,
        "type": d.type,
        "size": d.size,
        "source": d.source,
        "entitiesExtracted": d.entities_extracted,
        "relationshipsExtracted": d.relationships_extracted,
        "status": d.status,
        "uploadedAt": d.uploaded_at.strftime("%Y-%m-%d %H:%M") if d.uploaded_at else "",
        "processedBy": d.processed_by,
    }


@router.get("", response_model=List[DocumentItem])
async def list_documents(db: AsyncSession = Depends(get_db)):
    """Retrieve all ingested documents, newest first."""
    result = await db.execute(select(Document).order_by(desc(Document.uploaded_at)))
    docs = result.scalars().all()
    return [_doc_to_schema(d) for d in docs]


@router.get("/{doc_id}", response_model=DocumentItem)
async def get_document(doc_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a single document by its ID."""
    result = await db.execute(select(Document).where(Document.doc_id == doc_id))
    doc: Document | None = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    return _doc_to_schema(doc)


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("General Document"),
    db: AsyncSession = Depends(get_db),
):
    """Upload and ingest a document into the Knowledge Graph pipeline."""
    try:
        content = await file.read()
        size_kb = len(content) / 1024
        size_str = f"{size_kb:.1f} KB" if size_kb < 1024 else f"{size_kb / 1024:.1f} MB"
        doc_ext = file.filename.split(".")[-1].upper() if "." in file.filename else "TXT"

        new_doc = Document(
            doc_id=f"doc_{uuid.uuid4().hex[:12]}",
            name=file.filename,
            type=doc_ext,
            size=size_str,
            source=category or "User Upload",
            entities_extracted=0,
            relationships_extracted=0,
            status="Processing",
            uploaded_at=datetime.now(timezone.utc),
            processed_by="FastAPI Ingestion Worker",
        )
        db.add(new_doc)
        await db.flush()

        # Simulate entity extraction (update counts after "processing")
        new_doc.entities_extracted = max(10, len(content) // 500)
        new_doc.relationships_extracted = max(5, len(content) // 250)
        new_doc.status = "Completed"

        return {
            "success": True,
            "document": _doc_to_schema(new_doc),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")


@router.delete("/{doc_id}")
async def delete_document(doc_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a document from the knowledge base."""
    result = await db.execute(select(Document).where(Document.doc_id == doc_id))
    doc: Document | None = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    await db.delete(doc)
    return {"success": True, "deleted_id": doc_id}
