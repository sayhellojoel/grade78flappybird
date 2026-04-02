/**
 * Local leaderboard backed by localStorage.
 * Keeps the same fetchTopScores / submitScore interface as the old
 * Supabase version so no other files need to change.
 * Scores are stored per-device. When Supabase is re-enabled later,
 * swap this file back for the supabase client version.
 */
import type { HighScoreRow } from '../types';

const STORAGE_KEY = 'flappy_rhema_scores';

function loadScores(): HighScoreRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HighScoreRow[]) : [];
  } catch {
    return [];
  }
}

function saveScores(rows: HighScoreRow[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    // storage full or unavailable – silently ignore
  }
}

export async function fetchTopScores(): Promise<HighScoreRow[]> {
  const all = loadScores();
  return all
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export async function submitScore(
  name: string,
  score: number,
  theme: string
): Promise<boolean> {
  const rows = loadScores();
  const entry: HighScoreRow = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: name.slice(0, 15),
    score,
    theme,
    created_at: new Date().toISOString(),
  };
  rows.push(entry);
  saveScores(rows);
  return true;
}
