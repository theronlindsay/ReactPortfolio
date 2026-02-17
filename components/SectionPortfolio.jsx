'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltCard from '@/components/TiltCard';

export default function SectionPortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/portfolio');
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

  // Extract unique tags
  const uniqueTags = ['All', ...new Set(items.flatMap(item => item.tags || []))].filter(Boolean);

  // Filter items
  const filteredItems = selectedTag === 'All' 
    ? items 
    : items.filter(item => (item.tags || []).includes(selectedTag));

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Filter Bar — fixed on all screens: above bottom navbar on mobile, below top navbar on desktop */}
      <div className="fixed bottom-22 left-0 right-0 z-40 px-4 overflow-x-auto scrollbar-hide md:top-2 md:bottom-auto md:px-12 md:pt-20">
        <div className="flex gap-2 min-[640px]:flex-wrap min-[640px]:justify-center md:pb-30">
          {uniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`
                px-4 py-1.5 rounded-full text-sm transition-all whitespace-nowrap border
                ${selectedTag === tag 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                  : 'glass-pill text-zinc-400 hover:border-white/20 hover:text-zinc-200'}
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-4 md:pt-60 md:px-12 pb-32 md:pb-8 overflow-y-auto h-full scrollbar-hide justify-items-center content-start max-w-7xl mx-auto w-full">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            layout // Animate layout changes when filtering
          >
          <TiltCard>
          <Card className="glass-panel glass-panel-hover text-zinc-100 overflow-hidden transition-all duration-300 group h-full flex flex-col rounded-2xl">
            {item.imageUrl && (
              <div className={`h-48 overflow-hidden relative ${item.isLogo ? 'p-4' : ''}`}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className={`w-full h-full ${item.isLogo ? 'object-contain' : 'object-cover grayscale group-hover:grayscale-0'} transition-all duration-500`} 
                />
              </div>
            )}
            
            <CardHeader className="p-6 pb-2">
              <CardTitle className="flex justify-between items-start">
                <span className="text-xl font-semibold group-hover:text-blue-400 transition-colors">{item.title}</span>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="glass-button-3d rounded-lg p-2">
                    <ExternalLink className="w-4 h-4 text-zinc-400 relative z-10" />
                  </a>
                )}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="border-zinc-700 text-zinc-400 text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow space-y-4 p-6 pt-0">
              {item.description && <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>}
              
              {item.customHtml && (
                <div className="mt-4 p-2 border border-dashed border-zinc-800 rounded bg-black/50">
                   <div className="text-m text-zinc-600 mb-2 flex items-center gap-1">
                      <Code className="w-3 h-3" /> CUSTOM RENDER
                   </div>
                   <div dangerouslySetInnerHTML={{ __html: item.customHtml }} />
                </div>
              )}
            </CardContent>
          </Card>
          </TiltCard>
        </motion.div>
        ))}
      </div>
    </div>
  );
}
