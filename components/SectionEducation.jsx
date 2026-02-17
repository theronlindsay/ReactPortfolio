'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import TiltCard from '@/components/TiltCard';

export default function SectionEducation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/education');
        const data = await res.json();
        if (data.success) setItems(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div className="text-center p-10 text-blue-400 animate-pulse">LOADING DATA...</div>;

  const formal = items.filter(i => i.type === 'Formal');
  const technical = items.filter(i => i.type === 'Technical');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto p-20 pt-16 md:pt-50 pb-24 md:pb-12 overflow-y-auto h-full scrollbar-hide flex flex-col items-center">
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        <TiltCard className="w-full">
        <motion.div variants={container} initial="hidden" animate="show" className="glass-panel rounded-2xl p-6">
          <h3 className="text-xl mt-2 font-semibold text-blue-400 mb-6 border-b border-blue-900/30 pb-2">FORMAL EDUCATION</h3>
          <div className="space-y-6">
            {formal.map((item) => (
              <motion.div key={item._id} variants={itemAnim}>
                <div className="relative pl-8 border-l border-white/10">
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <div className="mb-1 text-xs text-zinc-500">{item.startDate} - {item.endDate}</div>
                  <h4 className="text-lg font-bold text-zinc-200">{item.institution}</h4>
                  <div className="text-blue-300 mb-2">{item.degree}</div>
                  <p className="text-sm text-zinc-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </TiltCard>

        <TiltCard className="w-full">
        <motion.div variants={container} initial="hidden" animate="show" className="glass-panel rounded-2xl p-6">
          <h3 className="text-xl mt-2 font-semibold text-green-400 mb-6 border-b border-green-900/30 pb-2">TECHNICAL / CERTS</h3>
          <div className="space-y-6">
            {technical.map((item) => (
              <motion.div key={item._id} variants={itemAnim}>
                <div className="relative pl-8 border-l border-white/10">
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <div className="mb-1 text-xs text-zinc-500">{item.startDate} - {item.endDate}</div>
                  <h4 className="text-lg font-bold text-zinc-200">{item.institution}</h4>
                  <div className="text-green-300 mb-2">{item.degree}</div>
                  <p className="text-sm text-zinc-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </TiltCard>
      </div>
    </div>
  );
}
