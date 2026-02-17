'use client';

import { motion } from 'framer-motion';
import { TabsList, TabsTrigger } from '@radix-ui/react-tabs'; // Using primitives via shadcn exports if available, otherwise standard
import { cn } from '@/lib/utils';
// Note: Shadcn TabsTrigger usually includes the button. We want to wrap/customize it.

export default function LiquidNavbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4 md:top-6 md:bottom-auto">
      <div className="flex p-2 glass-navbar rounded-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300",
              activeTab === tab.id ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }} // Remove mobile tap highlight
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="liquid-pill"
                className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 mix-blend-plus-lighter border-none outline-hidden">{tab.label.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
