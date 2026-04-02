import { createClient } from '@supabase/supabase-js';
import type { HighScoreRow } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchTopScores(): Promise<HighScoreRow[]> {
  const { data, error } = await supabase
    .from('high_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('fetchTopScores error:', error);
    return [];
  }
  return (data as HighScoreRow[]) ?? [];
}

export async function submitScore(
  name: string,
  score: number,
  theme: string
): Promise<boolean> {
  const { error } = await supabase
    .from('high_scores')
    .insert([{ name: name.slice(0, 15), score, theme }]);

  if (error) {
    console.error('submitScore error:', error);
    return false;
  }
  return true;
}
