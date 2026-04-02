export type Theme = 'plain' | 'fairy' | 'spaceship';

export type GamePhase =
  | 'idle'       // start screen
  | 'waiting'    // game area visible, waiting for first tap
  | 'playing'    // active gameplay
  | 'exploding'  // bird just died, explosion animation
  | 'gameover';  // all lives gone

export interface ObstaclePair {
  id: number;
  /** pixels from left edge of game area */
  x: number;
  /** gap center Y in pixels from top of game area */
  gapCenterY: number;
  /** gap height in pixels */
  gapHeight: number;
  /** has the bird passed this pair */
  passed: boolean;
  /** has the logo been collected */
  logoCollected: boolean;
}

export interface GameState {
  phase: GamePhase;
  /** bird Y position in pixels from top of game area */
  birdY: number;
  /** bird vertical velocity in pixels/second */
  birdVelocity: number;
  obstacles: ObstaclePair[];
  score: number;
  lives: number;
  /** position of the explosion (pixels from top-left of game area) */
  explosionPos: { x: number; y: number } | null;
  nextObstacleId: number;
  /** frames since last obstacle spawned */
  framesSinceSpawn: number;
}

export interface HighScoreRow {
  id: string;
  name: string;
  score: number;
  theme: string;
  created_at: string;
}
