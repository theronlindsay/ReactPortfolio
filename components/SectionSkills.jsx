'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TiltCard from '@/components/TiltCard';
import IconRenderer from '@/components/IconRenderer';
import { pauseForDebugLoading } from '@/lib/debug-loading';
import TerminalLoading from '@/components/TerminalLoading';

export default function SectionSkills() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/skills');
        const data = await res.json();
        if (data.success) setItems(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        await pauseForDebugLoading();
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col items-center overflow-y-auto px-6 pt-16 pb-44 md:pt-24 md:pb-4">
        <TerminalLoading cwd="~/skills" command="ls -la skills/" />
      </div>
    );
  }

  // Group by category if desired, or just list
  const categories = [...new Set(items.map(i => i.category || 'Other'))];

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col items-center overflow-y-auto p-6 pt-0 pb-44 scrollbar-hide md:p-20 md:pt-24 md:pb-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {categories.map((cat, catIndex) => (
          <motion.div 
            key={cat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <TiltCard className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-semibold text-zinc-300 mb-4 border-b border-zinc-800 pb-2 uppercase tracking-wider">{cat}</h3>
            <div className="flex flex-wrap gap-4">
              {items.filter(i => (i.category || 'Other') === cat).map((item) => (
                <div key={item._id} className="flex flex-col items-center gap-2 min-w-[60px] group cursor-default">
                  <div className="w-12 h-12 flex items-center justify-center glass-icon rounded-lg group-hover:border-blue-500/50 transition-all duration-300 text-2xl">
                    {item.type === 'Emoji' ? (
                      <span>{item.value}</span>
                    ) : (
                      <IconRenderer className={`${item.value} text-zinc-400 group-hover:text-blue-400 transition-colors`} />
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 group-hover:text-blue-300 transition-colors">{item.name}</span>
                </div>
              ))}
            </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
