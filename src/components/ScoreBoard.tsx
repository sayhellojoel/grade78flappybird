import React from 'react';
import type { Theme } from '../types';

interface ScoreBoardProps {
  score: number;
  lives: number;
  theme: Theme;
}

const THEME_LABELS: Record<Theme, string> = {
  plain: 'PLAIN',
  fairy: 'FAIRY',
  spaceship: 'SPACE',
};

const THEME_STYLES: Record<Theme, { bg: string; text: string; border: string }> = {
  plain: {
    bg: 'bg-black border-b-2 border-green-500',
    text: 'text-green-400',
    border: '',
  },
  fairy: {
    bg: 'bg-purple-900 border-b-2 border-pink-400',
    text: 'text-pink-300',
    border: '',
  },
  spaceship: {
    bg: 'bg-blue-950 border-b-2 border-cyan-400',
    text: 'text-cyan-300',
    border: '',
  },
};

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, lives, theme }) => {
  const style = THEME_STYLES[theme];

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 ${style.bg} ${style.text} pixel-font shrink-0`}
      style={{ fontSize: 11, minHeight: 44 }}
    >
      {/* Score */}
      <div className="flex flex-col leading-tight">
        <span style={{ fontSize: 8, opacity: 0.7 }}>SCORE</span>
        <span style={{ fontSize: 14 }}>{String(score).padStart(4, '0')}</span>
      </div>

      {/* Lives */}
      <div className="flex gap-1 items-center">
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            style={{ fontSize: 18, opacity: i < lives ? 1 : 0.2 }}
          >
            {theme === 'fairy' ? '💜' : theme === 'spaceship' ? '🚀' : '❤️'}
          </span>
        ))}
      </div>

      {/* Theme */}
      <div className="flex flex-col items-end leading-tight">
        <span style={{ fontSize: 8, opacity: 0.7 }}>THEME</span>
        <span style={{ fontSize: 10 }}>{THEME_LABELS[theme]}</span>
      </div>
    </div>
  );
};
