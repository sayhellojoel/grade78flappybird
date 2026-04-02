import React from 'react';
import { motion } from 'framer-motion';
import type { Theme } from '../types';

interface StartScreenProps {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onStart: () => void;
  onHighScores: () => void;
}

const THEME_CONFIGS: Record<Theme, {
  bg: string;
  title: string;
  btn: string;
  label: string;
  selected: string;
}> = {
  plain: {
    bg: 'bg-black',
    title: 'text-green-400',
    btn: 'bg-green-700 hover:bg-green-600 text-black border border-green-400',
    label: 'text-green-300',
    selected: 'border-2 border-green-300 bg-green-800 text-green-100',
  },
  fairy: {
    bg: 'bg-gradient-to-b from-purple-900 via-pink-900 to-purple-950',
    title: 'text-pink-300',
    btn: 'bg-pink-600 hover:bg-pink-500 text-white border border-pink-300',
    label: 'text-pink-200',
    selected: 'border-2 border-pink-300 bg-pink-700 text-white',
  },
  spaceship: {
    bg: 'bg-gradient-to-b from-blue-950 via-indigo-950 to-black',
    title: 'text-cyan-300',
    btn: 'bg-cyan-800 hover:bg-cyan-700 text-white border border-cyan-300',
    label: 'text-cyan-200',
    selected: 'border-2 border-cyan-300 bg-cyan-900 text-white',
  },
};

const THEMES: { id: Theme; name: string; emoji: string }[] = [
  { id: 'plain', name: 'Plain', emoji: '🕹️' },
  { id: 'fairy', name: 'Fairy', emoji: '🧚' },
  { id: 'spaceship', name: 'Space', emoji: '🚀' },
];

export const StartScreen: React.FC<StartScreenProps> = ({
  theme,
  onThemeChange,
  onStart,
  onHighScores,
}) => {
  const cfg = THEME_CONFIGS[theme];

  return (
    <motion.div
      className={`flex flex-col items-center justify-center w-full h-full ${cfg.bg} pixel-font overflow-hidden relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Floating sparkles (fairy) */}
      {theme === 'fairy' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 18 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-300"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: 10 + Math.random() * 10,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              ✦
            </motion.div>
          ))}
        </div>
      )}

      {/* Stars (spaceship) */}
      {theme === 'spaceship' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() < 0.2 ? 3 : 1,
                height: Math.random() < 0.2 ? 3 : 1,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <motion.div
        className={`text-center mb-8 ${cfg.title}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div style={{ fontSize: 'clamp(16px, 5vw, 28px)', lineHeight: 1.3 }}>
          FLAPPY
        </div>
        <div style={{ fontSize: 'clamp(20px, 6vw, 36px)', lineHeight: 1.3 }}>
          RHEMA
        </div>
        <motion.div
          className="mt-2 text-yellow-400"
          style={{ fontSize: 'clamp(8px, 2.5vw, 14px)' }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          ⭐ RHEMA CHRISTIAN SCHOOL ⭐
        </motion.div>
      </motion.div>

      {/* Bird preview */}
      <motion.div
        style={{ fontSize: 48, marginBottom: 24 }}
        animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        🐦
      </motion.div>

      {/* Theme selector */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={`text-center mb-2 ${cfg.label}`} style={{ fontSize: 9 }}>
          SELECT THEME
        </div>
        <div className="flex gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`px-3 py-2 pixel-font transition-all ${
                theme === t.id
                  ? cfg.selected
                  : `border border-gray-600 text-gray-400 bg-transparent hover:border-gray-400`
              }`}
              style={{ fontSize: 8, minWidth: 72, cursor: 'pointer' }}
            >
              <div style={{ fontSize: 16, marginBottom: 4 }}>{t.emoji}</div>
              {t.name.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col gap-3 items-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={onStart}
          className={`px-8 py-3 pixel-font ${cfg.btn} transition-all active:scale-95`}
          style={{ fontSize: 13, cursor: 'pointer', minWidth: 200 }}
        >
          ▶ START GAME
        </button>
        <button
          onClick={onHighScores}
          className={`px-6 py-2 pixel-font border ${cfg.label} border-current bg-transparent hover:bg-white/10 transition-all active:scale-95`}
          style={{ fontSize: 10, cursor: 'pointer', minWidth: 200 }}
        >
          🏆 HIGH SCORES
        </button>
      </motion.div>

      {/* Controls hint */}
      <motion.div
        className={`absolute bottom-6 text-center ${cfg.label}`}
        style={{ fontSize: 7 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        SPACE / TAP TO FLAP
      </motion.div>
    </motion.div>
  );
};
