import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RhemaLogoProps {
  x: number;           // center X of the gap
  y: number;           // center Y of the gap
  visible: boolean;
  collected: boolean;
}

const LOGO_SIZE = 38;

export const RhemaLogo: React.FC<RhemaLogoProps> = ({ x, y, visible, collected }) => {
  return (
    <AnimatePresence>
      {visible && !collected && (
        <motion.div
          key="logo"
          style={{
            position: 'absolute',
            left: x - LOGO_SIZE / 2,
            top: y - LOGO_SIZE / 2,
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(255,255,200,0.8)',
            boxShadow: '0 0 10px rgba(255,255,0,0.6)',
            pointerEvents: 'none',
            zIndex: 8,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.3, scale: { repeat: Infinity, duration: 1.2 } }}
        >
          <img
            src="/rhema-logo.png"
            alt="Rhema"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>
      )}
      {collected && (
        <motion.div
          key="collect-burst"
          style={{
            position: 'absolute',
            left: x - LOGO_SIZE,
            top: y - LOGO_SIZE,
            width: LOGO_SIZE * 2,
            height: LOGO_SIZE * 2,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <img
            src="/rhema-logo.png"
            alt=""
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
