import React from 'react';
import type { Theme } from '../types';

interface BirdProps {
  x: number;
  y: number;
  rotation: number;
  size: number;
  theme: Theme;
  isExploding?: boolean;
}

const WING_CONFIGS: Record<Theme, { body: string; eye: string; wing: string; beak: string }> = {
  plain: {
    body: '#ffff00',
    eye: '#00ff00',
    wing: '#cccc00',
    beak: '#ff8800',
  },
  fairy: {
    body: '#ff99cc',
    eye: '#cc44cc',
    wing: '#ff66aa',
    beak: '#ff6699',
  },
  spaceship: {
    body: '#44aaff',
    eye: '#00ffff',
    wing: '#2266cc',
    beak: '#ff6600',
  },
};

export const Bird: React.FC<BirdProps> = ({ x, y, rotation, size, theme, isExploding }) => {
  if (isExploding) return null;
  const c = WING_CONFIGS[theme];
  const r = size / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="22" cy="24" rx="16" ry="14" fill={c.body} />
        {/* Wing */}
        <ellipse cx="16" cy="28" rx="9" ry="5" fill={c.wing} transform="rotate(-20 16 28)" />
        {/* Eye white */}
        <circle cx="30" cy="18" r="6" fill="white" />
        {/* Eye pupil */}
        <circle cx="32" cy="17" r="3" fill={c.eye} />
        {/* Eye shine */}
        <circle cx="33" cy="16" r="1" fill="white" />
        {/* Beak */}
        <polygon points="38,20 44,23 38,26" fill={c.beak} />
        {/* Beak highlight */}
        <polygon points="38,20 44,23 40,21" fill="#ffcc88" />
      </svg>
    </div>
  );
};
