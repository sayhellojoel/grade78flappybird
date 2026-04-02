import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitScore } from '../lib/supabase';
import type { Theme } from '../types';

interface GameOverScreenProps {
  score: number;
  theme: Theme;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

const THEME_CFG: Record<Theme, { bg: string; title: string; text: string; btn: string; input: string }> = {
  plain: {
    bg: 'bg-black',
    title: 'text-green-400',
    text: 'text-green-300',
    btn: 'bg-green-700 hover:bg-green-600 text-black border border-green-400',
    input: 'bg-black border-green-500 text-green-300 focus:border-green-300',
  },
  fairy: {
    bg: 'bg-gradient-to-b from-purple-900 to-pink-950',
    title: 'text-pink-300',
    text: 'text-pink-200',
    btn: 'bg-pink-600 hover:bg-pink-500 text-white border border-pink-300',
    input: 'bg-purple-900 border-pink-500 text-pink-200 focus:border-pink-300',
  },
  spaceship: {
    bg: 'bg-gradient-to-b from-blue-950 to-black',
    title: 'text-cyan-300',
    text: 'text-cyan-200',
    btn: 'bg-cyan-800 hover:bg-cyan-700 text-white border border-cyan-300',
    input: 'bg-blue-950 border-cyan-600 text-cyan-200 focus:border-cyan-300',
  },
};

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  theme,
  onPlayAgain,
  onMainMenu,
}) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const cfg = THEME_CFG[theme];

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('ENTER A NAME FIRST');
      return;
    }
    setSubmitting(true);
    setError('');
    const ok = await submitScore(name.trim(), score, theme);
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
    } else {
      setError('SUBMIT FAILED – TRY AGAIN');
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center w-full h-full ${cfg.bg} pixel-font px-6`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <motion.div
        className={`text-center mb-6 ${cfg.title}`}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div style={{ fontSize: 'clamp(18px, 5vw, 28px)' }}>GAME OVER</div>
      </motion.div>

      {/* Score */}
      <motion.div
        className={`text-center mb-8 ${cfg.text}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <div style={{ fontSize: 9, marginBottom: 6 }}>FINAL SCORE</div>
        <div style={{ fontSize: 'clamp(28px, 8vw, 48px)', color: '#ffdd00' }}>
          {String(score).padStart(4, '0')}
        </div>
      </motion.div>

      {/* Score submission */}
      {!submitted ? (
        <motion.div
          className={`w-full max-w-xs mb-6 ${cfg.text}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{ fontSize: 8, marginBottom: 8, textAlign: 'center' }}>
            ENTER YOUR NAME (MAX 15 CHARS)
          </div>
          <input
            type="text"
            maxLength={15}
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="YOUR NAME"
            className={`w-full px-3 py-2 pixel-font border-2 outline-none text-center ${cfg.input}`}
            style={{ fontSize: 11, letterSpacing: 2 }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {error && (
            <div className="text-red-400 text-center mt-2" style={{ fontSize: 7 }}>
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full mt-3 py-2 pixel-font ${cfg.btn} transition-all active:scale-95 disabled:opacity-50`}
            style={{ fontSize: 9, cursor: 'pointer' }}
          >
            {submitting ? 'SUBMITTING...' : '🏆 SUBMIT SCORE'}
          </button>
        </motion.div>
      ) : (
        <motion.div
          className={`mb-6 text-center ${cfg.text}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ fontSize: 10 }}
        >
          ✅ SCORE SUBMITTED!
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <button
          onClick={onPlayAgain}
          className={`py-3 pixel-font ${cfg.btn} transition-all active:scale-95`}
          style={{ fontSize: 11, cursor: 'pointer' }}
        >
          ▶ PLAY AGAIN
        </button>
        <button
          onClick={onMainMenu}
          className={`py-3 pixel-font border ${cfg.text} border-current bg-transparent hover:bg-white/10 transition-all active:scale-95`}
          style={{ fontSize: 10, cursor: 'pointer' }}
        >
          ← MAIN MENU
        </button>
      </motion.div>
    </motion.div>
  );
};
