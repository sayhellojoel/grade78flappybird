import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTopScores } from '../lib/supabase';
import type { HighScoreRow, Theme } from '../types';

interface HighScoresScreenProps {
  theme: Theme;
  onBack: () => void;
}

const THEME_CFG: Record<Theme, { bg: string; title: string; text: string; row: string; btn: string }> = {
  plain: {
    bg: 'bg-black',
    title: 'text-green-400',
    text: 'text-green-300',
    row: 'border-b border-green-900',
    btn: 'border border-green-500 text-green-300 hover:bg-green-900',
  },
  fairy: {
    bg: 'bg-gradient-to-b from-purple-900 to-pink-950',
    title: 'text-pink-300',
    text: 'text-pink-200',
    row: 'border-b border-pink-900',
    btn: 'border border-pink-500 text-pink-200 hover:bg-pink-900',
  },
  spaceship: {
    bg: 'bg-gradient-to-b from-blue-950 to-black',
    title: 'text-cyan-300',
    text: 'text-cyan-200',
    row: 'border-b border-cyan-900',
    btn: 'border border-cyan-600 text-cyan-200 hover:bg-cyan-950',
  },
};

const RANK_ICONS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const THEME_ICONS: Record<string, string> = {
  plain: '🕹️',
  fairy: '🧚',
  spaceship: '🚀',
};

export const HighScoresScreen: React.FC<HighScoresScreenProps> = ({ theme, onBack }) => {
  const [rows, setRows] = useState<HighScoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cfg = THEME_CFG[theme];

  useEffect(() => {
    setLoading(true);
    fetchTopScores()
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch(() => {
        setError('FAILED TO LOAD SCORES');
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      className={`flex flex-col w-full h-full ${cfg.bg} pixel-font`}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${cfg.row} shrink-0`}>
        <button
          onClick={onBack}
          className={`px-3 py-1 ${cfg.btn} bg-transparent pixel-font transition-all active:scale-95`}
          style={{ fontSize: 9, cursor: 'pointer' }}
        >
          ← BACK
        </button>
        <div className={`${cfg.title} flex-1 text-center`} style={{ fontSize: 12 }}>
          🏆 HIGH SCORES
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Column headers */}
      <div
        className={`flex px-4 py-2 ${cfg.text} opacity-60 shrink-0`}
        style={{ fontSize: 7 }}
      >
        <span style={{ width: 36 }}>#</span>
        <span style={{ flex: 1 }}>NAME</span>
        <span style={{ width: 64, textAlign: 'right' }}>SCORE</span>
        <span style={{ width: 36, textAlign: 'center' }}>SKIN</span>
      </div>

      {/* Scores list */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${cfg.text}`}>
        {loading && (
          <motion.div
            className="flex items-center justify-center h-32"
            style={{ fontSize: 9 }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            LOADING...
          </motion.div>
        )}
        {error && (
          <div className="flex items-center justify-center h-32 text-red-400" style={{ fontSize: 8 }}>
            {error}
          </div>
        )}
        {!loading && !error && rows.length === 0 && (
          <div className="flex items-center justify-center h-32 opacity-60" style={{ fontSize: 8 }}>
            NO SCORES YET – BE FIRST!
          </div>
        )}
        {!loading && rows.map((row, i) => (
          <motion.div
            key={row.id}
            className={`flex items-center px-4 py-3 ${cfg.row}`}
            style={{ fontSize: 8 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <span style={{ width: 36, fontSize: 16 }}>{RANK_ICONS[i] ?? `${i + 1}.`}</span>
            <span style={{ flex: 1, letterSpacing: 1 }}>{row.name.toUpperCase()}</span>
            <span style={{ width: 64, textAlign: 'right', color: '#ffdd00', fontSize: 11 }}>
              {String(row.score).padStart(4, '0')}
            </span>
            <span style={{ width: 36, textAlign: 'center', fontSize: 14 }}>
              {THEME_ICONS[row.theme] ?? '🎮'}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Footer hint */}
      <div
        className={`shrink-0 text-center py-3 opacity-40 ${cfg.text}`}
        style={{ fontSize: 7 }}
      >
        GLOBAL LEADERBOARD – TOP 10
      </div>
    </motion.div>
  );
};
