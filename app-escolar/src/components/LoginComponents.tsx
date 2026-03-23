// ============================================
// RUTA: src/components/LoginComponents.tsx
// PROPÓSITO: Componentes visuales reutilizables de la pantalla de login.
//            Vive junto a SwarmButterflies.tsx en src/components/.
//
// Componentes exportados:
//   C               → paleta de colores del tema dorado
//   LogoArea        → encabezado con ícono, título y subtítulo
//   FieldInput      → campo de texto con ícono y animación de entrada
//   LoginBtn        → botón principal con animación de escala
//   CharacterPanel  → personaje flotante con auras y mariposas
// ============================================

import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SwarmButterflies} from './SwarmButterflies';

// ─── Paleta de colores — extraídos del login.css ─────────────────────────────
export const C = {
  bg: '#0a0806',
  glass: 'rgba(18,12,6,0.82)',
  glassBorder: 'rgba(192,164,100,0.22)',
  accent: '#c9a84c',
  accentDark: '#a07830',
  accentDeep: '#5c3a08',
  label: '#c4a87a',
  textSub: '#a89070',
  textMain: '#f0ebe0',
  inputBg: 'rgba(30,18,6,0.65)',
  inputBorder: 'rgba(192,164,100,0.28)',
  inputFocus: 'rgba(201,168,76,0.65)',
  inputText: '#f0e8d8',
  placeholder: 'rgba(168,144,112,0.45)',
  glow: 'rgba(201,168,76,0.3)',
};

// ============================================
// LogoArea
// ============================================
// Encabezado: ícono circular, título y subtítulo.
// Equivalente a LogoLogin.tsx de la web.
export const LogoArea = () => (
  <View style={{alignItems: 'center', gap: 6}}>
    <View style={{
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: 'rgba(201,168,76,0.1)',
      borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.35)',
      alignItems: 'center', justifyContent: 'center',
      shadowColor: C.accent, shadowOpacity: 0.25, shadowRadius: 22,
      marginBottom: 4,
    }}>
      <Text style={{fontSize: 26}}>🏛️</Text>
    </View>
    <Text style={{
      fontSize: 26, fontWeight: '900', color: C.accent, letterSpacing: -0.5,
      textShadowColor: 'rgba(201,168,76,0.4)', textShadowRadius: 12,
      textShadowOffset: {width: 0, height: 0},
    }}>
      Pandora's Box
    </Text>
    <Text style={{fontSize: 13, color: C.textSub}}>
      Abre la caja, descubre tu mundo
    </Text>
  </View>
);

// ============================================
// FieldInput
// ============================================
// Campo de texto reutilizable con ícono, label y animación de entrada.
// Equivalente a InputLogin.tsx de la web.
interface FieldInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  icon: string;
  delay?: number;
}

export const FieldInput = ({label, value, onChange, placeholder, secure = false, icon, delay = 0}: FieldInputProps) => {
  const borderColor = useRef(new Animated.Value(0)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;

  // Animación de entrada al montar
  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1, duration: 500, delay,
      easing: Easing.out(Easing.quad), useNativeDriver: true,
    }).start();
  }, []);

  // Borde animado al enfocar/desenfocar
  const onFocus = () => Animated.timing(borderColor, {toValue: 1, duration: 200, useNativeDriver: false}).start();
  const onBlur  = () => Animated.timing(borderColor, {toValue: 0, duration: 200, useNativeDriver: false}).start();

  const animatedBorder = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [C.inputBorder, C.inputFocus],
  });

  return (
    <Animated.View style={{
      marginBottom: 14,
      opacity: enterAnim,
      transform: [{translateY: enterAnim.interpolate({inputRange: [0, 1], outputRange: [14, 0]})}],
    }}>
      <Text style={{
        fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
        textTransform: 'uppercase', color: C.label, marginBottom: 6,
      }}>
        {label}
      </Text>
      <Animated.View style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.inputBg, borderRadius: 12,
        borderWidth: 1.5, borderColor: animatedBorder,
      }}>
        <Text style={{paddingLeft: 14, fontSize: 15, color: C.textSub}}>{icon}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={C.placeholder}
          secureTextEntry={secure}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 15, color: C.inputText}}
          autoCapitalize="none"
        />
      </Animated.View>
    </Animated.View>
  );
};

// ============================================
// LoginBtn
// ============================================
// Botón del formulario con animación de entrada y escala al presionar.
// Equivalente a ButtonLogin.tsx de la web.
interface LoginBtnProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
}

export const LoginBtn = ({onPress, title, disabled = false}: LoginBtnProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1, duration: 500, delay: 700,
      easing: Easing.out(Easing.quad), useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn  = () => Animated.spring(scale, {toValue: 0.97, useNativeDriver: true}).start();
  const onPressOut = () => Animated.spring(scale, {toValue: 1,    useNativeDriver: true}).start();

  return (
    <Animated.View style={{
      marginTop: 8,
      opacity: disabled ? 0.6 : enterAnim,
      transform: [
        {scale},
        {translateY: enterAnim.interpolate({inputRange: [0, 1], outputRange: [14, 0]})},
      ],
    }}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          gap: 8, paddingVertical: 14, paddingHorizontal: 24,
          borderRadius: 14, backgroundColor: C.accentDark,
          borderWidth: 1, borderColor: C.accentDeep,
          shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 20,
          shadowOffset: {width: 0, height: 4}, elevation: 8,
        }}
      >
        <Text style={{color: '#f5ead0', fontSize: 16, fontWeight: '700', letterSpacing: 0.4}}>
          {title}
        </Text>
        <Text style={{color: '#f5ead0', fontSize: 18}}>→</Text>
      </Pressable>
    </Animated.View>
  );
};

// ============================================
// CharacterPanel
// ============================================
// Panel con la imagen de Pandora flotando, auras concéntricas y mariposas.
// Equivalente a CharacterLogo.tsx de la web.
export const CharacterPanel = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Flotación: 0 → -15px → 0
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, {toValue: -15, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(floatAnim, {toValue: 0,   duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();

    // Pulsación de auras: escala 1 → 1.08 → 1
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, {toValue: 1.08, duration: 1750, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(pulseAnim, {toValue: 1,    duration: 1750, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();

    // Respiración del glow: opacidad 0.5 → 0.9 → 0.5
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, {toValue: 0.9, duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(glowAnim, {toValue: 0.5, duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();
  }, []);

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', minHeight: 280, flex: 1}}>
      <View style={{width: 260, height: 340, alignItems: 'center', justifyContent: 'center'}}>

        {/* Auras concéntricas — de mayor a menor */}
        <Animated.View style={{position: 'absolute', width: 260, height: 330, borderRadius: 1000, backgroundColor: 'rgba(100,70,20,0.04)', transform: [{scale: pulseAnim}]}} />
        <Animated.View style={{position: 'absolute', width: 240, height: 300, borderRadius: 1000, borderWidth: 1, borderColor: 'rgba(160,120,48,0.1)', backgroundColor: 'rgba(160,120,48,0.05)', transform: [{scale: pulseAnim}]}} />
        <Animated.View style={{position: 'absolute', width: 200, height: 250, borderRadius: 1000, borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)', backgroundColor: 'rgba(201,168,76,0.08)', transform: [{scale: pulseAnim}]}} />

        {/* Glow debajo de la imagen */}
        <Animated.View style={{
          position: 'absolute', bottom: 20, width: 130, height: 200, borderRadius: 100,
          backgroundColor: C.glow, shadowColor: C.accent, shadowOpacity: 0.6,
          shadowRadius: 40, shadowOffset: {width: 0, height: 0}, opacity: glowAnim,
        }} />

        {/* Imagen flotante */}
        <Animated.View style={{alignItems: 'center', justifyContent: 'center', zIndex: 10, transform: [{translateY: floatAnim}]}}>
          <Image source={require('../../assets/pandora.png')} style={{width: 250, height: 250}} />
        </Animated.View>

        {/* Mariposas doradas animadas */}
        <SwarmButterflies sceneWidth={260} sceneHeight={340} count={12} scale={0.6} />
      </View>
    </View>
  );
};
