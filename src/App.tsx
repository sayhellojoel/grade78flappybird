import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StartScreen } from './screens/StartScreen';
import { GameScreen } from './screens/GameScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { HighScoresScreen } from './screens/HighScoresScreen';
import type { Theme } from './types';

type Screen = 'start' | 'game' | 'gameover' | 'highscores';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  // Theme persists across the entire session
  const [theme, setTheme] = useState<Theme>('plain');
  const [finalScore, setFinalScore] = useState(0);

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setScreen('gameover');
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <StartScreen
            key="start"
            theme={theme}
            onThemeChange={setTheme}
            onStart={() => setScreen('game')}
            onHighScores={() => setScreen('highscores')}
          />
        )}
        {screen === 'game' && (
          <GameScreen
            key="game"
            theme={theme}
            onGameOver={handleGameOver}
          />
        )}
        {screen === 'gameover' && (
          <GameOverScreen
            key="gameover"
            score={finalScore}
            theme={theme}
            onPlayAgain={() => setScreen('game')}
            onMainMenu={() => setScreen('start')}
          />
        )}
        {screen === 'highscores' && (
          <HighScoresScreen
            key="highscores"
            theme={theme}
            onBack={() => setScreen('start')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
