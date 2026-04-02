import React from 'react';
import { motion } from 'framer-motion';
import type { Theme } from '../types';

interface ExplosionProps {
  x: number;
  y: number;
  theme: Theme;
}

// ── Plain: pixel block explosion ──────────────────────────────────
const PlainExplosion: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const blocks = [
    { dx: 0, dy: -1, color: '#ffff00' },
    { dx: 1, dy: -1, color: '#ff8800' },
    { dx: 1, dy: 0, color: '#ffff00' },
    { dx: 1, dy: 1, color: '#ff4400' },
    { dx: 0, dy: 1, color: '#ffff00' },
    { dx: -1, dy: 1, color: '#ff8800' },
    { dx: -1, dy: 0, color: '#ff4400' },
    { dx: -1, dy: -1, color: '#ffff00' },
    { dx: 0, dy: -2, color: '#00ff44' },
    { dx: 2, dy: 0, color: '#00ff44' },
    { dx: 0, dy: 2, color: '#00ff44' },
    { dx: -2, dy: 0, color: '#00ff44' },
  ];

  return (
    <>
      {blocks.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: x - 6,
            top: y - 6,
            width: 12,
            height: 12,
            background: b.color,
            borderRadius: 2,
            zIndex: 20,
            pointerEvents: 'none',
            imageRendering: 'pixelated',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: b.dx * 55,
            y: b.dy * 55,
            opacity: 0,
            scale: [1, 1.4, 0.2],
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      ))}
      {/* Central flash */}
      <motion.div
        style={{
          position: 'absolute',
          left: x - 24,
          top: y - 24,
          width: 48,
          height: 48,
          background: '#ffffff',
          borderRadius: 4,
          zIndex: 19,
          pointerEvents: 'none',
        }}
        initial={{ opacity: 1, scale: 0.5 }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
};

// ── Fairy: heart explosion ────────────────────────────────────────
const HEART_PATH =
  'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z';

const FairyExplosion: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const hearts = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    const dist = 60 + Math.random() * 30;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      color: i % 2 === 0 ? '#ff69b4' : '#ff1493',
      delay: i * 0.04,
      scale: 0.6 + Math.random() * 0.8,
    };
  });

  return (
    <>
      {hearts.map((h, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            left: x - 12,
            top: y - 12,
            width: 24,
            height: 24,
            zIndex: 20,
            pointerEvents: 'none',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: h.scale }}
          animate={{ x: h.dx, y: h.dy, opacity: 0, scale: h.scale * 0.3 }}
          transition={{ duration: 0.8, delay: h.delay, ease: 'easeOut' }}
        >
          <path d={HEART_PATH} fill={h.color} />
        </motion.svg>
      ))}
      {/* Sparkle ring */}
      <motion.div
        style={{
          position: 'absolute',
          left: x - 40,
          top: y - 40,
          width: 80,
          height: 80,
          border: '4px solid #ff99ff',
          borderRadius: '50%',
          zIndex: 19,
          pointerEvents: 'none',
        }}
        initial={{ scale: 0.2, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    </>
  );
};

// ── Spaceship: fire explosion ─────────────────────────────────────
const SpaceExplosion: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 50 + Math.random() * 50;
    const colors = ['#ff4400', '#ff8800', '#ffcc00', '#ff2200'];
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      color: colors[i % colors.length],
      delay: i * 0.03,
      size: 6 + Math.random() * 10,
    };
  });

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: x - p.size / 2,
            top: y - p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, #ffffff 0%, ${p.color} 60%, transparent 100%)`,
            zIndex: 20,
            pointerEvents: 'none',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.75, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
      {/* Shockwave ring */}
      <motion.div
        style={{
          position: 'absolute',
          left: x - 30,
          top: y - 30,
          width: 60,
          height: 60,
          border: '3px solid #00ffff',
          borderRadius: '50%',
          zIndex: 19,
          pointerEvents: 'none',
          boxShadow: '0 0 12px #00ffff',
        }}
        initial={{ scale: 0.3, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.55 }}
      />
      {/* Inner flash */}
      <motion.div
        style={{
          position: 'absolute',
          left: x - 20,
          top: y - 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffffff 0%, #ffcc00 50%, #ff4400 100%)',
          zIndex: 21,
          pointerEvents: 'none',
        }}
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 0.35 }}
      />
    </>
  );
};

export const ExplosionEffect: React.FC<ExplosionProps> = ({ x, y, theme }) => {
  if (theme === 'fairy') return <FairyExplosion x={x} y={y} />;
  if (theme === 'spaceship') return <SpaceExplosion x={x} y={y} />;
  return <PlainExplosion x={x} y={y} />;
};
