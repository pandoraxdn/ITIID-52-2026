// ============================================
// RUTA: src/screens/home/sections/HeroSection.tsx
// ============================================

import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

// Imágenes — asegúrate de tener estos assets en src/assets/
const schoolBg = require('../../../../assets/school-bg.jpg');
const pandoraLogo = require('../../../../assets/pandora.png');

interface Props {
  onAdmisiones: () => void;
  onConocenos:  () => void;
}

export const HeroSection = ({onAdmisiones, onConocenos}: Props) => {
  // Animación de entrada del texto
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  // Animación del logo
  const logoFade  = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  // Pulso del logo
  const logoPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  {toValue: 1, duration: 800, useNativeDriver: true}),
      Animated.timing(slideAnim, {toValue: 0, duration: 800, useNativeDriver: true}),
    ]).start();

    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoFade,  {toValue: 1, duration: 600, useNativeDriver: true}),
        Animated.spring(logoScale, {toValue: 1, friction: 6, useNativeDriver: true}),
      ]),
    ]).start();

    // Pulso continuo del logo
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {toValue: 1.04, duration: 2000, useNativeDriver: true}),
        Animated.timing(logoPulse, {toValue: 1,    duration: 2000, useNativeDriver: true}),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.container}>
      {/* Fondo con imagen y gradiente */}
      <ImageBackground source={schoolBg} style={StyleSheet.absoluteFill} resizeMode="cover">
        <View style={styles.overlay} />
      </ImageBackground>

      {/* Partículas decorativas (círculos dorados estáticos) */}
      {[...Array(6)].map((_, i) => (
        <View key={i} style={[styles.particle, {
          top:  `${15 + i * 13}%` as any,
          left: `${5 + (i % 3) * 30}%` as any,
          width: 4 + (i % 3) * 3,
          height: 4 + (i % 3) * 3,
          opacity: 0.3 + (i % 3) * 0.15,
        }]} />
      ))}

      <View style={styles.content}>
        {/* Logo animado */}
        <Animated.View style={[styles.logoWrapper, {
          opacity: logoFade,
          transform: [{scale: Animated.multiply(logoScale, logoPulse)}],
        }]}>
          <View style={styles.logoGlow} />
          <Image source={pandoraLogo} style={styles.logoImage} resizeMode="contain" />
        </Animated.View>

        {/* Texto animado */}
        <Animated.View style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
          <Text style={styles.title}>
            Formando el futuro,{'\n'}un estudiante a la vez
          </Text>
          <Text style={styles.subtitle}>
            En el Centro Educativo Pandora cultivamos el conocimiento, los valores
            y la creatividad desde la educación inicial hasta la preparatoria.
          </Text>

          {/* Botones */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnPrimary} onPress={onAdmisiones} activeOpacity={0.8}>
              <Text style={styles.btnPrimaryText}>Proceso de Admisión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={onConocenos} activeOpacity={0.8}>
              <Text style={styles.btnSecondaryText}>Conócenos</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:     {height: height * 0.78, justifyContent: 'flex-end'},
  overlay:       {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,8,6,0.55)',
  },
  particle:      {position: 'absolute', borderRadius: 999, backgroundColor: '#c9a84c'},
  content:       {padding: 28, paddingBottom: 40, gap: 24, alignItems: 'center'},
  logoWrapper:   {position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 8},
  logoGlow:      {
    position: 'absolute',
    width: 340, height: 340, borderRadius: 100,
    backgroundColor: 'rgba(201,168,76,0.15)',
    // sombra con blur (solo iOS; en Android no se ve blur pero sí el color)
    shadowColor: '#c9a84c', shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6, shadowRadius: 30, elevation: 8,
  },
  logoImage:     {width: 320, height: 320, borderRadius: 100},
  title:         {
    fontSize: 28, fontWeight: '800', color: '#f0ebe0',
    textAlign: 'center', lineHeight: 36, marginBottom: 14,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 2}, textShadowRadius: 6,
  },
  subtitle:      {
    fontSize: 14, color: '#c8bfb0', textAlign: 'center',
    lineHeight: 22, marginBottom: 24, paddingHorizontal: 4,
  },
  buttons:       {flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center'},
  btnPrimary:    {
    paddingHorizontal: 22, paddingVertical: 12, borderRadius: 10,
    backgroundColor: '#c9a84c',
    shadowColor: '#c9a84c', shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 6,
  },
  btnPrimaryText:  {color: '#0a0806', fontWeight: '700', fontSize: 14},
  btnSecondary:    {
    paddingHorizontal: 22, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#c9a84c',
    backgroundColor: 'rgba(201,168,76,0.1)',
  },
  btnSecondaryText: {color: '#c9a84c', fontWeight: '700', fontSize: 14},
});
