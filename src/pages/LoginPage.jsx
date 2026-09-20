import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Network,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('hariesh.raj@enterprise.ai');
    setPassword('Admin@2026!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      await login({ email, password, rememberMe });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-panel border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Branding & Network Visual */}
        <div className="bg-slate-900 p-8 sm:p-10 flex flex-col justify-between text-white border-r border-slate-800 relative overflow-hidden">
          {/* Subtle network background lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="net-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="#38bdf8" />
                <line x1="20" y1="20" x2="40" y2="20" stroke="#38bdf8" strokeWidth="0.5" />
                <line x1="20" y1="20" x2="20" y2="40" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#net-grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white mb-6 shadow-subtle">
              <Network className="w-6 h-6 stroke-[2]" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              Knowledge Graph Chatbot
            </h1>
            <p className="text-xs text-brand-400 font-medium tracking-wide uppercase mt-1">
              AI-Powered Enterprise Knowledge Discovery
            </p>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Query complex multi-hop ontologies, verify factual provenance against structured triples, and retrieve grounded answers powered by hybrid vector and knowledge graph models.
            </p>
          </div>

          {/* Academic / Enterprise Feature Badges */}
          <div className="space-y-2.5 relative z-10 my-8">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Grounded, Hallucination-Resistant LLM Answers</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Network className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Interactive Cypher Graph Traversal</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Full Provenance & Source Grounding</span>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Academic & Enterprise Knowledge Graph Platform &copy; 2026
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your credentials to access the Knowledge Graph assistant.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="mb-4 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Authentication successful. Loading workspace...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@enterprise.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been dispatched to your registered address.');
                  }}
                  className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Remember this device
                </span>
              </label>

              {/* Demo auto-fill helper */}
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline"
              >
                Use Demo Admin
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Assistant
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
