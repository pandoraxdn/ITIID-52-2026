/**
 * SwarmButterflies.tsx
 * 
 * Versión que SÍ funciona en iOS y Android.
 * 
 * El problema anterior: las mariposas usaban translateX/Y desde un origen
 * desconocido. Ahora el componente recibe el tamaño del contenedor padre
 * (o usa un default de 260x340) y calcula top/left absolutos para cada
 * mariposa en cada keyframe, sin depender de '50%' ni de que el padre
 * tenga alignItems:'center'.
 * 
 * USO:
 *   // Dentro del characterScene (View de 260x340):
 *   <SwarmButterflies />
 *   <SwarmButterflies count={8} />
 *   <SwarmButterflies count={12} sceneWidth={260} sceneHeight={340} />
 */

import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';

// Colores dorados del CSS
const GOLD = ['#b8860b', '#c9a84c', '#a07820'];

// Posiciones [x, y] relativas al centro, extraídas del CSS (text-shadow offsets)
// Escaladas a 0.6 para móvil
const SCALE = 0.6;

const KF_RAW: [number, number][][] = [
  // 0% / 100%
  [[-120, -150], [140, -80], [-180, 40], [160, 100], [-140, 180], [110, 200],
  [-30, -200], [180, -130], [-200, -60], [130, -180], [-80, 220], [60, -120]],
  // 33%
  [[-140, -80], [80, -160], [-100, 120], [190, -10], [-60, 200], [140, 100],
  [40, -140], [110, -220], [-140, -160], [70, -90], [-160, 40], [120, -160]],
  // 66%
  [[-90, -190], [160, -40], [-210, -10], [110, 140], [-190, 70], [30, 220],
  [-110, -90], [170, -130], [-40, -190], [200, -70], [-30, 140], [190, -30]],
  // 100% = 0%
  [[-120, -150], [140, -80], [-180, 40], [160, 100], [-140, 180], [110, 200],
  [-30, -200], [180, -130], [-200, -60], [130, -180], [-80, 220], [60, -120]],
];

const SEG_MS = 3333;

interface ButterflyProps {
  index: number;
  centerX: number;  // centro horizontal del padre en px
  centerY: number;  // centro vertical del padre en px
  scale: number;
  delay: number;
}

const Butterfly = ({index, centerX, centerY, scale, delay}: ButterflyProps) => {
  const color = GOLD[index % 3];

  // left/top absolutos = centro + offset del keyframe
  const initLeft = centerX + KF_RAW[0][index][0] * scale;
  const initTop = centerY + KF_RAW[0][index][1] * scale;

  const left = useRef(new Animated.Value(initLeft)).current;
  const top = useRef(new Animated.Value(initTop)).current;
  const op = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const seg = (fromKf: number) => {
      const toKf = (fromKf + 1) % 4;
      const [ox, oy] = KF_RAW[toKf][index];
      return Animated.parallel([
        Animated.timing(left, {
          toValue: centerX + ox * scale,
          duration: SEG_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,  // left/top no soportan nativeDriver
        }),
        Animated.timing(top, {
          toValue: centerY + oy * scale,
          duration: SEG_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(op, {
          toValue: toKf === 1 ? 1.0 : toKf === 2 ? 0.65 : 0.85,
          duration: SEG_MS,
          useNativeDriver: false,
        }),
      ]);
    };

    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        seg(0), seg(1), seg(2),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left,
        top,
        fontSize: 18,
        color: color,
        opacity: op,
        textShadowColor: color,
        textShadowRadius: 16,
        textShadowOffset: {width: 0, height: 0},
        zIndex: 10,
      }}
    >
      🦋
    </Animated.Text>
  );
};

// ── Props ────────────────────────────────────────────────────────────────────
interface SwarmProps {
  /** Mariposas a mostrar (1–12). Default: 12 */
  count?: number;
  /**
   * Escala de los offsets de posición.
   * 0.5 = pantallas pequeñas, 0.6 = móvil (default), 0.8 = tablet
   */
  scale?: number;
  /** Ancho del contenedor padre en px. Default: 260 */
  sceneWidth?: number;
  /** Alto del contenedor padre en px. Default: 340 */
  sceneHeight?: number;
}

export const SwarmButterflies = ({
  count = 12,
  scale = SCALE,
  sceneWidth = 260,
  sceneHeight = 340,
}: SwarmProps) => {
  const n = Math.min(Math.max(Math.round(count), 1), 12);
  // Centro del contenedor padre
  const cx = sceneWidth / 2;
  const cy = sceneHeight / 2;

  return (
    <>
      {Array.from({length: n}, (_, i) => (
        <Butterfly
          key={i}
          index={i}
          centerX={cx}
          centerY={cy}
          scale={scale}
          delay={i * 90}
        />
      ))}
    </>
  );
};
