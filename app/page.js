'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LiquidNavbar from '@/components/LiquidNavbar';
import SectionPortfolio from '@/components/SectionPortfolio';
import SectionEducation from '@/components/SectionEducation';
import SectionSkills from '@/components/SectionSkills';
import SectionAbout from '@/components/SectionAbout';

export default function Home() {
  const [activeTab, setActiveTab] = useState('portfolio');

  const renderSection = () => {
    switch (activeTab) {
      case 'portfolio': return <SectionPortfolio />;
      case 'education': return <SectionEducation />;
      case 'skills': return <SectionSkills />;
      case 'about': return <SectionAbout />;
      default: return <SectionPortfolio />;
    }
  };

  return (
    <main className="h-screen w-screen relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background/CRT Layer is handled in layout.js globally */}
      
      {/* Content Area */}
      <div className="w-full h-full md:pt-20 mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <LiquidNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Decorative Text */}
      <div className="fixed top-4 left-4 text-xs font-mono text-zinc-600 z-0 pointer-events-none hidden md:block">
        SYS.STATUS: ONLINE<br/>
        NO. 734-92
      </div>
    </main>
  );
}
