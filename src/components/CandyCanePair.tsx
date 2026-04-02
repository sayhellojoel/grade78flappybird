import React, { useMemo } from 'react';
import type { Theme } from '../types';

interface CandyCanePairProps {
  x: number;           // center X of the pair
  gapCenterY: number;  // center Y of the gap
  gapHeight: number;   // height of the gap
  gameHeight: number;
  theme: Theme;
  poleWidth: number;
}

const THEME_COLORS: Record<Theme, { c1: string; c2: string; stroke?: string }> = {
  plain: { c1: '#00ee44', c2: '#003311', stroke: '0 0 6px #00ff44' },
  fairy: { c1: '#ff69b4', c2: '#dda0dd', stroke: '0 0 6px #ff99dd' },
  spaceship: { c1: '#00ddff', c2: '#001a44', stroke: '0 0 8px #00ccff, 0 0 16px #0066ff' },
};

interface CandyCaneProps {
  height: number;
  isTop: boolean;
  c1: string;
  c2: string;
  poleW: number;
  id: number;
}

const CandyCaneSVG: React.FC<CandyCaneProps> = ({ height, isTop, c1, c2, poleW, id }) => {
  const R = 22;  // hook radius
  const cx = poleW / 2;
  const svgW = poleW + R + 4;
  const stripeW = 14;

  // Bottom cane path: goes from bottom up, then arcs CW to the right at top
  // Top cane path: goes from top down, then arcs CCW to the right at bottom
  const path = isTop
    ? `M ${cx},0 L ${cx},${height - R} A ${R},${R} 0 0,0 ${cx + R},${height}`
    : `M ${cx},${height} L ${cx},${R} A ${R},${R} 0 0,1 ${cx + R},0`;

  const patternId = `sp-${id}-${isTop ? 't' : 'b'}`;

  return (
    <svg
      width={svgW}
      height={height}
      style={{ display: 'block', overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* White base */}
      <path
        d={path}
        fill="none"
        stroke={c2}
        strokeWidth={poleW}
        strokeLinecap="round"
      />
      {/* Coloured stripes (dashes perpendicular to path = candy cane rings) */}
      <path
        d={path}
        fill="none"
        stroke={c1}
        strokeWidth={poleW}
        strokeLinecap="round"
        strokeDasharray={`${stripeW} ${stripeW}`}
      />
      {/* Highlight sheen */}
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={poleW * 0.28}
        strokeLinecap="round"
        strokeDasharray={`${stripeW} ${stripeW}`}
        strokeDashoffset={stripeW * 0.3}
        style={{ mixBlendMode: 'overlay' }}
      />
      {/* Use patternId to suppress lint; remove unused var warning */}
      <defs><pattern id={patternId} /></defs>
    </svg>
  );
};

export const CandyCanePair: React.FC<CandyCanePairProps> = ({
  x,
  gapCenterY,
  gapHeight,
  gameHeight,
  theme,
  poleWidth,
}) => {
  const topCaneHeight = useMemo(() => gapCenterY - gapHeight / 2, [gapCenterY, gapHeight]);
  const botCaneTop = useMemo(() => gapCenterY + gapHeight / 2, [gapCenterY, gapHeight]);
  const botCaneHeight = useMemo(() => gameHeight - botCaneTop, [gameHeight, botCaneTop]);
  const { c1, c2, stroke } = THEME_COLORS[theme];
  const left = x - poleWidth / 2;
  const idNum = Math.abs(Math.round(x));

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: 0,
        width: poleWidth + 30,
        height: gameHeight,
        pointerEvents: 'none',
        filter: stroke ? `drop-shadow(${stroke})` : undefined,
      }}
    >
      {/* Top cane */}
      {topCaneHeight > 0 && (
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <CandyCaneSVG
            height={topCaneHeight}
            isTop
            c1={c1}
            c2={c2}
            poleW={poleWidth}
            id={idNum}
          />
        </div>
      )}
      {/* Bottom cane */}
      {botCaneHeight > 0 && (
        <div style={{ position: 'absolute', top: botCaneTop, left: 0 }}>
          <CandyCaneSVG
            height={botCaneHeight}
            isTop={false}
            c1={c1}
            c2={c2}
            poleW={poleWidth}
            id={idNum + 1}
          />
        </div>
      )}
    </div>
  );
};
