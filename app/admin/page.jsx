'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import PortfolioEditor from './components/PortfolioEditor';
import EducationEditor from './components/EducationEditor';
import SkillsEditor from './components/SkillsEditor';
import ProfileEditor from './components/ProfileEditor';

function LoginGate({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('admin_token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Invalid password');
        setPassword('');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-6">
      <div className="glass-panel rounded-2xl p-8 w-full max-w-sm">
        {/* Terminal-style title bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="flex-1 text-center text-xs font-mono text-zinc-500">admin@portfolio</span>
        </div>

        <div className="font-mono text-sm space-y-4">
          <div className="text-zinc-400">
            <span className="text-green-400">admin</span>
            <span className="text-zinc-600">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-zinc-600">$</span>
            <span className="text-zinc-200 ml-2">sudo access /admin</span>
          </div>

          <div className="text-zinc-500">[sudo] password required for admin:</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              autoFocus
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-zinc-200 font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all"
            />

            {error && (
              <div className="text-red-400 text-xs font-mono">
                Error: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full glass-button-3d rounded-xl py-3 font-mono text-sm text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed relative z-10"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                'AUTHENTICATE →'
              )}
            </button>
          </form>

          {/* Blinking cursor */}
          <div className="text-zinc-400 pt-1">
            <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated via session
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setAuthenticated(false);
  };

  if (checking) {
    return <div className="h-screen bg-black flex items-center justify-center text-zinc-500 font-mono animate-pulse">Loading...</div>;
  }

  if (!authenticated) {
    return <LoginGate onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="h-screen bg-black text-zinc-100 p-8 overflow-y-auto scrollbar-hide">
      <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ADMIN CONSOLE
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleLogout} className="border-red-900/50 text-red-400 hover:bg-red-900/20 hover:text-red-300">
            Logout
          </Button>
          <Button variant="outline" onClick={() => router.push('/')} className="border-zinc-700 hover:bg-zinc-900">
            Back to Site
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-zinc-800">Portfolio</TabsTrigger>
          <TabsTrigger value="education" className="data-[state=active]:bg-zinc-800">Education</TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-zinc-800">Skills</TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 min-h-[500px]">
          <h2 className="text-xl mb-4 font-semibold text-blue-400 font-mono">:: PORTFOLIO MANAGER</h2>
          <PortfolioEditor />
        </TabsContent>

        <TabsContent value="education" className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 min-h-[500px]">
          <h2 className="text-xl mb-4 font-semibold text-green-400 font-mono">:: EDUCATION MANAGER</h2>
          <EducationEditor />
        </TabsContent>

        <TabsContent value="skills" className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 min-h-[500px]">
          <h2 className="text-xl mb-4 font-semibold text-yellow-400 font-mono">:: SKILL MANAGER</h2>
          <SkillsEditor />
        </TabsContent>

        <TabsContent value="profile" className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 min-h-[500px]">
          <h2 className="text-xl mb-4 font-semibold text-pink-400 font-mono">:: PROFILE MANAGER</h2>
          <ProfileEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
