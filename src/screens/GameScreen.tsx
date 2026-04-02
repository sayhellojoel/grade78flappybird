import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from '../hooks/useGameEngine';
import { ScoreBoard } from '../components/ScoreBoard';
import { Bird } from '../components/Bird';
import { CandyCanePair } from '../components/CandyCanePair';
import { RhemaLogo } from '../components/RhemaLogo';
import { ExplosionEffect } from '../components/ExplosionEffect';
import type { Theme } from '../types';

interface GameScreenProps {
  theme: Theme;
  onGameOver: (score: number) => void;
}

const BG_STYLES: Record<Theme, React.CSSProperties> = {
  plain: { background: '#000000' },
  fairy: {
    background: 'linear-gradient(180deg, #2d1b4e 0%, #4a1942 50%, #1a0a2e 100%)',
  },
  spaceship: {
    background: 'linear-gradient(180deg, #000510 0%, #001030 60%, #000820 100%)',
  },
};

export const GameScreen: React.FC<GameScreenProps> = ({ theme, onGameOver }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [showTapHint, setShowTapHint] = useState(true);
  const hasStarted = useRef(false);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  // Measure the game area
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { state, flap, resetGame, birdRotation, BIRD_VISUAL, POLE_WIDTH } = useGameEngine(
    dims.w,
    dims.h
  );

  // Trigger game over
  useEffect(() => {
    if (state.phase === 'gameover') {
      const t = setTimeout(() => onGameOverRef.current(state.score), 600);
      return () => clearTimeout(t);
    }
  }, [state.phase, state.score]);

  // Reset when mounted
  useEffect(() => {
    resetGame();
    hasStarted.current = false;
    setShowTapHint(true);
  }, [resetGame]);

  // Hide tap hint after first flap
  useEffect(() => {
    if (state.phase === 'playing' && !hasStarted.current) {
      hasStarted.current = true;
      setTimeout(() => setShowTapHint(false), 1500);
    }
  }, [state.phase]);

  const handleInteraction = useCallback(() => {
    if (state.phase === 'exploding' || state.phase === 'gameover') return;
    flap();
  }, [state.phase, flap]);

  // Keyboard (spacebar)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleInteraction();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleInteraction]);

  const gameAreaStyle: React.CSSProperties = {
    ...BG_STYLES[theme],
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
    cursor: 'pointer',
  };

  const isExploding = state.phase === 'exploding';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <ScoreBoard score={state.score} lives={state.lives} theme={theme} />

      <div
        ref={containerRef}
        style={gameAreaStyle}
        onPointerDown={handleInteraction}
      >
        {/* Theme-specific background particles */}
        {theme === 'fairy' && <FairyBg />}
        {theme === 'spaceship' && <StarfieldBg />}

        {dims.w > 0 && (
          <>
            {/* Candy cane pairs */}
            {state.obstacles.map((obs) => (
              <CandyCanePair
                key={obs.id}
                x={obs.x}
                gapCenterY={obs.gapCenterY}
                gapHeight={obs.gapHeight}
                gameHeight={dims.h}
                theme={theme}
                poleWidth={POLE_WIDTH}
              />
            ))}

            {/* Rhema logos */}
            {state.obstacles.map((obs) => (
              <RhemaLogo
                key={`logo-${obs.id}`}
                x={obs.x}
                y={obs.gapCenterY}
                visible={!isExploding || !obs.passed}
                collected={obs.logoCollected}
              />
            ))}

            {/* Bird */}
            <Bird
              x={dims.w * 0.25}
              y={state.birdY}
              rotation={birdRotation}
              size={BIRD_VISUAL}
              theme={theme}
              isExploding={isExploding}
            />

            {/* Explosion */}
            <AnimatePresence>
              {isExploding && state.explosionPos && (
                <ExplosionEffect
                  key="explosion"
                  x={state.explosionPos.x}
                  y={state.explosionPos.y}
                  theme={theme}
                />
              )}
            </AnimatePresence>

            {/* Waiting / tap hint overlay */}
            <AnimatePresence>
              {(state.phase === 'waiting' || (state.phase === 'playing' && showTapHint)) && (
                <motion.div
                  key="tap-hint"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 30,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="pixel-font text-center px-4"
                    style={{
                      color: theme === 'plain' ? '#00ff44' : theme === 'fairy' ? '#ffbbff' : '#00ffff',
                      fontSize: 'clamp(8px, 2.5vw, 13px)',
                      textShadow: '0 0 8px currentColor',
                      lineHeight: 1.8,
                      background: 'rgba(0,0,0,0.5)',
                      padding: '16px 24px',
                      borderRadius: 4,
                    }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    {state.phase === 'waiting' ? (
                      <>
                        TAP TO START
                        <br />
                        PRESS SPACE TO START
                      </>
                    ) : (
                      'TAP TO FLAP'
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

// ── Background elements ───────────────────────────────────────────

const FairyBg: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 20 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute text-pink-200"
        style={{
          left: `${(i * 17 + 5) % 100}%`,
          top: `${(i * 23 + 10) % 100}%`,
          fontSize: 8 + (i % 4) * 3,
          opacity: 0.15 + (i % 5) * 0.08,
        }}
        animate={{ y: [0, -20, 0], opacity: [0.15, 0.4, 0.15] }}
        transition={{
          duration: 3 + (i % 4),
          repeat: Infinity,
          delay: (i * 0.3) % 3,
        }}
      >
        {['✦', '✧', '♡', '✿'][i % 4]}
      </motion.div>
    ))}
  </div>
);

const StarfieldBg: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 80 }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          left: `${(i * 1237 + 43) % 100}%`,
          top: `${(i * 983 + 67) % 100}%`,
          width: i % 12 === 0 ? 3 : 1,
          height: i % 12 === 0 ? 3 : 1,
          opacity: 0.2 + (i % 5) * 0.12,
        }}
      />
    ))}
  </div>
);
