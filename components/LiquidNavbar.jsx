'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  GraduationCap,
  LayoutGrid,
  Mail,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiquidNavbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'portfolio', label: 'Portfolio', Icon: LayoutGrid },
    { id: 'about', label: 'About', Icon: UserRound },
    { id: 'skills', label: 'Skills', Icon: Code2 },
    { id: 'education', label: 'Education', Icon: GraduationCap },
    { id: 'contact', label: 'Contact', Icon: Mail },
  ];

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-0 sm:pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] md:top-4 md:bottom-auto md:pb-0">
      <div className="mx-auto flex w-full min-w-0 max-w-none min-[800px]:max-w-[72vw] flex-col items-stretch justify-center gap-1 px-0.5 sm:gap-1.5 sm:px-1 md:flex-col-reverse md:gap-3 md:px-2">
        {activeTab === 'portfolio' && (
          <div id="portfolio-filters-target" className="pointer-events-auto flex w-full justify-center empty:hidden" />
        )}
        <div className="glass-navbar pointer-events-auto mx-auto w-full min-w-0 max-w-none overflow-hidden rounded-full py-1.5 pl-1 pr-1 animate-float sm:py-2 sm:pl-1.5 sm:pr-1.5 md:py-2 md:pl-2 md:pr-2">
          <div className="flex min-h-0 w-full min-w-0 flex-nowrap items-stretch gap-0.5 py-0.5 sm:gap-1 md:gap-1.5">
            {tabs.map((tab) => {
              const { Icon } = tab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative flex min-h-0 min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-0.5 rounded-full px-0 py-1.5 text-[7px] font-medium leading-tight tracking-tight transition-colors duration-300 sm:py-2 sm:text-[8px] md:gap-1 md:py-2 md:text-[9px]',
                    activeTab === tab.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                  )}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layout="position"
                      layoutId="liquid-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    className="relative z-10 size-3.5 shrink-0 sm:size-4 md:size-[1.125rem]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="relative z-10 w-full truncate text-center uppercase outline-hidden mix-blend-plus-lighter">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
