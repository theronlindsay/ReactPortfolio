'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import PortfolioEditor from './components/PortfolioEditor';
import EducationEditor from './components/EducationEditor';
import SkillsEditor from './components/SkillsEditor';
import ProfileEditor from './components/ProfileEditor';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <div className="h-screen bg-black text-zinc-100 p-8 overflow-y-auto scrollbar-hide">
      <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ADMIN CONSOLE
        </h1>
        <Button variant="outline" onClick={() => router.push('/')} className="border-zinc-700 hover:bg-zinc-900">
          Back to Site
        </Button>
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
