import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameState, ObstaclePair } from '../types';

// ── Physics constants (pixels / second) ──────────────────────────
const GRAVITY = 2000;          // px/s²  – snappy, arcade-feel drop
const FLAP_VELOCITY = -700;    // px/s   – strong, punchy flap upward
const MAX_FALL = 1000;         // px/s   – fast terminal velocity
const BIRD_VISUAL = 56;        // px (diameter)
const BIRD_HIT_RATIO = 0.60;   // hitbox is 60% of visual (fair forgiveness)
const POLE_WIDTH = 56;         // px (candy cane visual width including hook)
const POLE_HIT_WIDTH = 46;     // px (hitbox width)

// ── Obstacle progression ──────────────────────────────────────────
const BASE_SPEED = 280;        // px/s at score 0 – noticeably fast from the start

function obstacleSpeed(score: number): number {
  // Steeper early ramp, then flattens. Much faster ceiling than before.
  return BASE_SPEED + Math.log1p(score / 2) * 160;
}

/**
 * Returns the base gap height for a given score.
 * Gaps start tighter and shrink faster than before.
 * Callers apply ±18% per-spawn randomness on top.
 */
function baseGapHeight(score: number, gameH: number): number {
  const maxGap = gameH * 0.38;   // smaller starting gap (was 0.42)
  const minGap = gameH * 0.19;   // tighter floor (was 0.22)
  return minGap + (maxGap - minGap) / (1 + score * 0.06); // faster shrink (was 0.04)
}

/**
 * Pixel distance between consecutive obstacle centres.
 *   score 0  → ~0.95 × gameW  (pairs arrive quickly, no relaxed warmup)
 *   score 8  → ~0.78 × gameW  (tight within 8 points)
 *   score 20 → ~0.65 × gameW  (two pairs visible)
 *   score 40+→ ~0.52 × gameW  (floor – always passable)
 */
function spawnInterval(score: number, gameW: number): number {
  const maxSpacing = gameW * 0.95;  // start much tighter than before (was 1.1)
  const minSpacing = gameW * 0.52;  // tighter floor (was 0.55)
  const t = 1 - 1 / (1 + score * 0.09);  // faster progression (was 0.055)
  return minSpacing + (maxSpacing - minSpacing) * (1 - t);
}

/**
 * Randomised gap centre Y for a given gap height.
 * Margin is tighter (8%) so the gap can appear close to the edges,
 * forcing the player to navigate high and low positions.
 */
function randomGapY(gapH: number, gameH: number): number {
  const margin = gameH * 0.08;
  const minY = margin + gapH / 2;
  const maxY = gameH - margin - gapH / 2;
  return minY + Math.random() * (maxY - minY);
}

// ── Collision helpers ─────────────────────────────────────────────
function birdHitbox(birdY: number, gameW: number) {
  const birdX = gameW * 0.25; // bird is always at 25% of game width
  const r = (BIRD_VISUAL * BIRD_HIT_RATIO) / 2;
  return { left: birdX - r, right: birdX + r, top: birdY - r, bottom: birdY + r };
}

function rectsOverlap(
  al: number, ar: number, at: number, ab: number,
  bl: number, br: number, bt: number, bb: number
): boolean {
  return al < br && ar > bl && at < bb && ab > bt;
}

function checkCollision(
  birdY: number,
  gameW: number,
  gameH: number,
  obstacles: ObstaclePair[]
): boolean {
  const hb = birdHitbox(birdY, gameW);

  // Boundary collision
  if (hb.top < 0 || hb.bottom > gameH) return true;

  // Obstacle collision
  for (const obs of obstacles) {
    const topCaneBottom = obs.gapCenterY - obs.gapHeight / 2;
    const botCaneTop = obs.gapCenterY + obs.gapHeight / 2;
    const caneLeft = obs.x - POLE_WIDTH / 2;
    const caneRight = obs.x + POLE_HIT_WIDTH / 2;

    // Top cane
    if (rectsOverlap(hb.left, hb.right, hb.top, hb.bottom, caneLeft, caneRight, 0, topCaneBottom)) {
      return true;
    }
    // Bottom cane
    if (rectsOverlap(hb.left, hb.right, hb.top, hb.bottom, caneLeft, caneRight, botCaneTop, gameH)) {
      return true;
    }
  }
  return false;
}

// ── Initial state ─────────────────────────────────────────────────
function initialState(gameH: number): GameState {
  return {
    phase: 'waiting',
    birdY: gameH * 0.45,
    birdVelocity: 0,
    obstacles: [],
    score: 0,
    lives: 3,
    explosionPos: null,
    nextObstacleId: 0,
    framesSinceSpawn: 0,
  };
}

// ── Hook ──────────────────────────────────────────────────────────
export function useGameEngine(gameW: number, gameH: number) {
  const [state, setState] = useState<GameState>(() => initialState(gameH));
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const explosionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Push a state update and sync ref
  const update = useCallback((patch: Partial<GameState> | ((s: GameState) => GameState)) => {
    setState((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      stateRef.current = next;
      return next;
    });
  }, []);

  // ── Flap ──────────────────────────────────────────────────────
  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === 'waiting') {
      update({ phase: 'playing', birdVelocity: FLAP_VELOCITY });
      return;
    }
    if (s.phase === 'playing') {
      update((prev) => ({ ...prev, birdVelocity: FLAP_VELOCITY }));
    }
  }, [update]);

  // ── Reset after explosion ─────────────────────────────────────
  const resetAfterDeath = useCallback((lives: number) => {
    update({
      phase: lives > 0 ? 'waiting' : 'gameover',
      birdY: gameH * 0.45,
      birdVelocity: 0,
      obstacles: [],
      explosionPos: null,
      framesSinceSpawn: 0,
      lives,
    });
  }, [gameH, update]);

  // ── Handle collision ──────────────────────────────────────────
  const handleCollision = useCallback((birdX: number, birdY: number) => {
    const s = stateRef.current;
    if (s.phase !== 'playing') return;
    const newLives = s.lives - 1;
    update({
      phase: 'exploding',
      explosionPos: { x: birdX, y: birdY },
      lives: newLives,
    });

    if (explosionTimerRef.current) clearTimeout(explosionTimerRef.current);
    explosionTimerRef.current = setTimeout(() => {
      resetAfterDeath(newLives);
    }, 2000);
  }, [update, resetAfterDeath]);

  // ── Main game loop ────────────────────────────────────────────
  const tick = useCallback((timestamp: number) => {
    const s = stateRef.current;

    if (s.phase !== 'playing') {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap at 50ms
    lastTimeRef.current = timestamp;

    const speed = obstacleSpeed(s.score);

    // Update bird physics
    let vel = s.birdVelocity + GRAVITY * dt;
    if (vel > MAX_FALL) vel = MAX_FALL;
    const newBirdY = s.birdY + vel * dt;

    // Update obstacles
    const newObstacles: ObstaclePair[] = [];
    let scoreInc = 0;
    const birdX = gameW * 0.25;

    for (const obs of s.obstacles) {
      const newX = obs.x - speed * dt;
      if (newX < -POLE_WIDTH) continue; // off screen, remove

      let { passed, logoCollected } = obs;
      if (!passed && newX < birdX) {
        passed = true;
        if (!logoCollected) {
          logoCollected = true;
          scoreInc++;
        }
      }
      newObstacles.push({ ...obs, x: newX, passed, logoCollected });
    }

    // Spawn new obstacle
    let newId = s.nextObstacleId;
    let newFramesSince = s.framesSinceSpawn + 1;
    const spawnEvery = spawnInterval(s.score, gameW) / (speed / 60); // frames

    if (s.obstacles.length === 0 || newFramesSince > spawnEvery) {
      // Add ±18% random variation on top of the score-based base so every
      // gap pair has a unique height, not just a unique Y position.
      const ghBase = baseGapHeight(s.score, gameH);
      const ghVariation = ghBase * 0.18 * (Math.random() * 2 - 1);
      const gh = Math.max(gameH * 0.20, Math.min(gameH * 0.46, ghBase + ghVariation));
      const gy = randomGapY(gh, gameH);
      newObstacles.push({
        id: newId++,
        x: gameW + POLE_WIDTH / 2 + 20,
        gapCenterY: gy,
        gapHeight: gh,
        passed: false,
        logoCollected: false,
      });
      newFramesSince = 0;
    }

    const newScore = s.score + scoreInc;

    // Check collision BEFORE committing new state
    if (checkCollision(newBirdY, gameW, gameH, newObstacles)) {
      handleCollision(birdX, newBirdY);
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    stateRef.current = {
      ...s,
      birdY: newBirdY,
      birdVelocity: vel,
      obstacles: newObstacles,
      score: newScore,
      nextObstacleId: newId,
      framesSinceSpawn: newFramesSince,
    };
    setState(stateRef.current);

    rafRef.current = requestAnimationFrame(tick);
  }, [gameW, gameH, handleCollision]);

  // Start / stop RAF loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (explosionTimerRef.current) clearTimeout(explosionTimerRef.current);
    };
  }, [tick]);

  // Reset game (called from UI)
  const resetGame = useCallback(() => {
    if (explosionTimerRef.current) clearTimeout(explosionTimerRef.current);
    const fresh = initialState(gameH);
    stateRef.current = fresh;
    setState(fresh);
  }, [gameH]);

  // Bird rotation based on velocity
  const birdRotation = Math.max(-25, Math.min(85, state.birdVelocity / 7));

  return { state, flap, resetGame, birdRotation, BIRD_VISUAL, POLE_WIDTH };
}
