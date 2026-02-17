'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import IconRenderer from '@/components/IconRenderer';
import TiltCard from '@/components/TiltCard';

export default function SectionAbout() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success) setProfile(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center p-10 text-grmd:pt-50een-400 font-mono animate-pulse">$ loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24 md:p-12  pb-24 md:pb-4 h-full flex flex-col justify-center items-center overflow-y-auto scrollbar-hide">
      <TiltCard className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl w-full relative overflow-hidden flex flex-col"
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/30">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="flex-1 text-center text-xs font-mono text-zinc-500">theron@portfolio: ~/profile</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-8 font-mono text-sm md:text-base space-y-4">
          {/* Command prompt */}
          <div className="text-zinc-400">
            <span className="text-green-400">theron@portfolio</span>
            <span className="text-zinc-600">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-zinc-600">$</span>
            <span className="text-zinc-200 ml-2">cat profile.md</span>
          </div>

          {/* Profile Image */}
          {profile?.imageUrl && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="my-4"
            >
              <div className="text-zinc-600 text-xs mb-2">┌─── profile_photo.jpg ───┐</div>
              <div className="relative w-full md:w-2/5 aspect-square rounded-lg overflow-hidden border border-white/10 group">
                <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="text-zinc-600 text-xs mt-2">└─────────────────────────┘</div>
            </motion.div>
          )}

          {/* About Text as terminal output */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-base md:text-lg pl-0">
              {profile?.aboutText || 'No profile information available.'}
            </div>
          </motion.div>

          {/* Social Links as terminal commands */}
          {profile?.socialLinks?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-4 border-t border-white/5 space-y-3"
            >
              <div className="text-zinc-400">
                <span className="text-green-400">theron@portfolio</span>
                <span className="text-zinc-600">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-zinc-600">$</span>
                <span className="text-zinc-200 ml-2">ls ./links/</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.socialLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 glass-pill rounded-lg hover:border-white/20 transition-all group"
                  >
                    {link.icon && <IconRenderer className={`${link.icon} text-zinc-400 group-hover:text-green-400 text-lg`} />}
                    <span className="text-sm text-zinc-400 group-hover:text-white">{link.platform}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Blinking cursor */}
          <div className="text-zinc-400 pt-2">
            <span className="text-green-400">theron@portfolio</span>
            <span className="text-zinc-600">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-zinc-600">$</span>
            <span className="ml-2 inline-block w-2 h-5 bg-green-400 animate-pulse" />
          </div>
        </div>
      </motion.div>
      </TiltCard>
    </div>
  );
}
