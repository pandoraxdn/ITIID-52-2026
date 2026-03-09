/**
 * LoginScreen.tsx
 *
 * Traducción FIEL al React Native del LoginPage.tsx del proyecto web.
 * Fuente de verdad: login.css, CharacterLogo.tsx, LogoLogin.tsx,
 * FormLogin.tsx, InputLogin.tsx, ButtonLogin.tsx, Particles.tsx
 *
 * Colores exactos del CSS:
 *   --lp-bg (dark):  radial-gradient(ellipse at 65% 55%, #1e1208 0%, #0a0806 65%)
 *   --lp-glass:      rgba(18,12,6,0.78)
 *   --lp-glass-border: rgba(192,164,100,0.22)
 *   --lp-accent:     #c9a84c
 *   --lp-label:      #c4a87a
 *   --lp-text-sub:   #a89070
 *   Botón gradient:  #5c3a08 → #c9a84c → #a07830
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {SwarmButterflies} from '@/components/SwarmButterflies';

const {width: W, height: H} = Dimensions.get('window');

// ─────────────────────────────────────────────
// COLORES — extraídos 1:1 del login.css .dark-mode
// ─────────────────────────────────────────────
const C = {
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
  particleColor: '#c9a84c',
  particleGlow: 'rgba(139,105,20,0.5)',
  aura1: 'rgba(201,168,76,0.14)',
  aura2: 'rgba(160,120,48,0.09)',
  glow: 'rgba(201,168,76,0.3)',
};

// ─────────────────────────────────────────────
// PARTÍCULAS — réplica exacta de useLoginPage.tsx
// Genera 55 partículas con posición, tamaño, duración y delay aleatorios
// ─────────────────────────────────────────────
interface ParticleData {
  id: number;
  x: number;       // % horizontal
  size: number;    // px
  duration: number; // segundos
  delay: number;   // segundos
  opacity: number;
}

function generateParticles(count = 55): ParticleData[] {
  return Array.from({length: count}, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 4 + 4,       // 4–8px (login.css: random*4+6, reducido para móvil)
    duration: Math.random() * 8 + 6,   // 6–14s
    delay: Math.random() * 8,          // 0–8s
    opacity: Math.random() * 0.6 + 0.2, // 0.2–0.8
  }));
}

// ─────────────────────────────────────────────
// Componente: una partícula individual animada
// Réplica del @keyframes particle-float del login.css:
//   translateY(0) → translateY(-100vh)  +  scale 1→1.2→0.5  + opacity → 0
// ─────────────────────────────────────────────
const Particle = React.memo(({p}: {p: ParticleData}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: p.duration * 1000,
        delay: p.delay * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -H * 1.1],
  });
  const scale = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 0.5],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [p.opacity, p.opacity * 0.7, 0],
  });

  // Cada 3ra partícula es humo/neblina (login.css :nth-child(3n))
  const isSmoke = p.id % 3 === 0;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        left: `${p.x}%` as any,
        width: isSmoke ? p.size * 2.5 : p.size,
        height: isSmoke ? p.size * 2.5 : p.size,
        borderRadius: isSmoke ? p.size : p.size / 2,
        backgroundColor: isSmoke ? 'rgba(240,230,210,0.1)' : C.particleColor,
        shadowColor: isSmoke ? 'transparent' : C.accentDark,
        shadowOpacity: isSmoke ? 0 : 0.7,
        shadowRadius: isSmoke ? 0 : p.size,
        opacity,
        transform: [{translateY}, {scale}],
      }}
    />
  );
});

// ─────────────────────────────────────────────
// Componente: LogoLogin — réplica de LogoLogin.tsx + .logo-area del CSS
// ─────────────────────────────────────────────
const LogoArea = () => (
  <View style={styles.logoArea}>
    {/* .logo-icon: círculo dorado con ícono de escuela */}
    <View style={styles.logoIcon}>
      {/* SVG School icon simulado con texto + forma */}
      <Text style={styles.logoIconText}>🏛️</Text>
    </View>
    {/* .brand-title: gradiente #c9a84c → #f0d898 → #a07830 */}
    <Text style={styles.brandTitle}>Pandora's Box</Text>
    {/* .brand-sub */}
    <Text style={styles.brandSub}>Abre la caja, descubre tu mundo</Text>
  </View>
);

// ─────────────────────────────────────────────
// Componente: InputLogin — réplica de InputLogin.tsx + .field-* del CSS
// ─────────────────────────────────────────────
const FieldInput = ({
  label,
  value,
  onChange,
  placeholder,
  secure = false,
  icon,
  delay = 0,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  icon: string;
  delay?: number;
}) => {
  const [focused, setFocused] = useState(false);
  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 500,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const animStyle = {
    opacity: enterAnim,
    transform: [{translateY: enterAnim.interpolate({inputRange: [0, 1], outputRange: [14, 0]})}],
  };

  return (
    <Animated.View style={[styles.fieldGroup, animStyle]}>
      {/* .field-label */}
      <Text style={styles.fieldLabel}>{label}</Text>
      {/* .field-wrap */}
      <View style={[
        styles.fieldWrap,
        focused && styles.fieldWrapFocused,
      ]}>
        {/* .field-icon */}
        <Text style={[styles.fieldIcon, focused && {color: C.accent}]}>{icon}</Text>
        {/* .field-input */}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={C.placeholder}
          secureTextEntry={secure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.fieldInput, {color: C.inputText}]}
          autoCapitalize="none"
          keyboardType={!secure ? 'email-address' : 'default'}
        />
      </View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────
// Componente: ButtonLogin — réplica de .login-btn + shimmer
// Gradiente: #5c3a08 → #c9a84c → #a07830
// ─────────────────────────────────────────────
const LoginBtn = ({onPress, title}: {onPress: () => void; title: string}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1, duration: 500, delay: 700,
      easing: Easing.out(Easing.quad), useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => Animated.spring(scale, {toValue: 0.97, useNativeDriver: true}).start();
  const onPressOut = () => Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start();

  return (
    <Animated.View style={{
      opacity: enterAnim,
      transform: [
        {scale},
        {translateY: enterAnim.interpolate({inputRange: [0, 1], outputRange: [14, 0]})},
      ],
      marginTop: 8,
    }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.loginBtn}
      >
        <Text style={styles.loginBtnText}>{title}</Text>
        <Text style={styles.loginBtnArrow}>→</Text>
      </Pressable>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────
// Componente: CharacterLogo — réplica de CharacterLogo.tsx + .character-panel
// Auras concéntricas + imagen flotante + glow blob
// ─────────────────────────────────────────────
const CharacterPanel = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // .character-img: @keyframes character-float — translateY 0 → -15px → 0
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, {toValue: -15, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(floatAnim, {toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();

    // .aura: @keyframes aura-pulse — scale 1→1.08→1
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, {toValue: 1.08, duration: 1750, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(pulseAnim, {toValue: 1, duration: 1750, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();

    // @keyframes glow-breathe
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, {toValue: 0.9, duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(glowAnim, {toValue: 0.5, duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();
  }, []);

  return (
    <View style={styles.characterPanel}>
      <View style={styles.characterScene}>
        {/* Aura 3 — más grande, más exterior */}
        <Animated.View style={[styles.aura, styles.aura3, {transform: [{scale: pulseAnim}]}]} />
        {/* Aura 2 */}
        <Animated.View style={[styles.aura, styles.aura2, {transform: [{scale: pulseAnim}]}]} />
        {/* Aura 1 — más pequeña, más interior */}
        <Animated.View style={[styles.aura, styles.aura1, {transform: [{scale: pulseAnim}]}]} />
        {/* Glow blob debajo de la imagen — .character-glow */}
        <Animated.View style={[styles.characterGlow, {opacity: glowAnim}]} />
        {/* Imagen flotante — .character-img + @keyframes fairy-pulse */}
        <Animated.View style={[styles.characterImgWrap, {transform: [{translateY: floatAnim}]}]}>
          {/*
            <Text style={styles.characterEmoji}>🏛️</Text>
            <Text style={styles.characterEmojiGlow}>✨</Text>
          */}
          <Image
            source={require('../../assets/pandora.png')}
            style={{width: 250, height: 250}}
          />
        </Animated.View>
        {/* .character-panel::after — enjambre de 12 mariposas doradas
            Recibe las dimensiones exactas del characterScene para calcular
            posiciones absolutas desde el centro */}
        <SwarmButterflies sceneWidth={260} sceneHeight={340} count={12} scale={0.6} />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────
// PANTALLA PRINCIPAL
// Estructura: .login-root > .login-layout (grid 1fr 1fr → en RN: row)
//   Izquierda: .form-panel (glassmorphism card)
//   Derecha:   .character-panel
// ─────────────────────────────────────────────
export default function LoginScreen({navigation}: {navigation?: any}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [particles] = useState(() => generateParticles(55));

  // .form-panel: opacity 0 + translateX(-30px) → form-mounted: opacity 1 + translateX(0)
  const panelAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(panelAnim, {
      toValue: 1, duration: 600, delay: 100,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    console.log({email, password});
    navigation?.navigate('Dashboard');
  };

  const isNarrow = W < 600;

  return (
    <View style={styles.root}>
      {/* ── Fondo: radial-gradient simulado con capas ── */}
      <View style={styles.bgGradient1} />
      <View style={styles.bgGradient2} />

      {/* ── Partículas ── */}
      <View style={styles.particlesContainer} pointerEvents="none">
        {particles.map(p => <Particle key={p.id} p={p} />)}
      </View>

      {/* ── Layout principal: column en móvil, row en tablet/web ── */}
      <ScrollView
        contentContainerStyle={[
          styles.loginLayout,
          isNarrow ? styles.loginLayoutNarrow : styles.loginLayoutWide,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* CHARACTER primero en móvil estrecho (order: -1 en CSS) */}
        {isNarrow && <CharacterPanel />}

        {/* FORM PANEL — .form-panel */}
        <Animated.View style={[
          styles.formPanel,
          isNarrow ? styles.formPanelNarrow : styles.formPanelWide,
          {
            opacity: panelAnim,
            transform: [{
              translateX: panelAnim.interpolate({inputRange: [0, 1], outputRange: [-30, 0]}),
            }],
          },
        ]}>
          <LogoArea />

          {/* Separador */}
          <View style={styles.separator} />

          {/* .login-form */}
          <View style={styles.loginForm}>
            <FieldInput
              label="Correo electrónico"
              value={email}
              onChange={setEmail}
              placeholder="tu@email.com"
              icon="✉"
              delay={400}
            />
            <FieldInput
              label="Contraseña"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              secure
              icon="🔑"
              delay={550}
            />
            <LoginBtn title="Iniciar sesión" onPress={handleLogin} />

            {/* .forgot-link */}
            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.forgotLinkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgotLink}
              onPress={() => navigation?.navigate('Home')}
            >
              <Text style={styles.forgotLinkText}>← Regresar al inicio</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* CHARACTER a la derecha en tablet/web */}
        {!isNarrow && <CharacterPanel />}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// ESTILOS — cada clase nombrada por su equivalente en login.css
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  // .login-root
  root: {
    flex: 1,
    backgroundColor: C.bg,
    overflow: 'hidden',
  },
  // Capas del radial-gradient: ellipse at 65% 55%, #1e1208 → #0a0806
  bgGradient1: {
    position: 'absolute',
    width: W * 1.4,
    height: H * 1.4,
    borderRadius: W * 0.7,
    backgroundColor: '#1e1208',
    top: H * 0.55 - H * 0.7,
    left: W * 0.65 - W * 0.7,
    opacity: 0.7,
  },
  bgGradient2: {
    position: 'absolute',
    inset: 0,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0a0806',
    opacity: 0.5,
  },
  // .particles-container
  particlesContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  // .login-layout — grid-template-columns: 1fr 1fr
  loginLayout: {
    flexGrow: 1,
    zIndex: 2,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  loginLayoutWide: {
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: H,
    gap: 24,
  },
  loginLayoutNarrow: {
    flexDirection: 'column',
    gap: 20,
  },
  // .form-panel
  formPanel: {
    backgroundColor: C.glass,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.glassBorder,
    padding: 32,
    // backdrop-filter simulado con opacity oscuro
    shadowColor: C.accent,
    shadowOpacity: 0.2,
    shadowRadius: 40,
    shadowOffset: {width: 0, height: 8},
    elevation: 16,
    gap: 16,
  },
  formPanelWide: {
    maxWidth: 460,
    flex: 1,
    alignSelf: 'center',
    margin: 16,
  },
  formPanelNarrow: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  // .logo-area
  logoArea: {
    alignItems: 'center',
    gap: 6,
  },
  // .logo-icon
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.accent,
    shadowOpacity: 0.25,
    shadowRadius: 22,
    marginBottom: 4,
  },
  logoIconText: {fontSize: 26},
  // .brand-title — gradiente simulado con color base dorado
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: C.accent,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(201,168,76,0.4)',
    textShadowRadius: 12,
    textShadowOffset: {width: 0, height: 0},
  },
  // .brand-sub
  brandSub: {
    fontSize: 13,
    color: C.textSub,
  },
  separator: {
    height: 1,
    backgroundColor: C.glassBorder,
    marginVertical: 4,
  },
  // .login-form
  loginForm: {
    gap: 4,
  },
  // .field-group
  fieldGroup: {
    marginBottom: 14,
  },
  // .field-label — uppercase, tracking, color label
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.label,
    marginBottom: 6,
  },
  // .field-wrap
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
  },
  fieldWrapFocused: {
    borderColor: C.inputFocus,
    shadowColor: C.accent,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 0},
  },
  // .field-icon
  fieldIcon: {
    paddingLeft: 14,
    fontSize: 15,
    color: C.textSub,
  },
  // .field-input
  fieldInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 13,
    fontSize: 15,
  },
  // .login-btn — gradiente #5c3a08 → #c9a84c → #a07830
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: C.accentDark,   // color medio del gradiente (RN no soporta gradiente sin librería)
    borderWidth: 1,
    borderColor: C.accentDeep,
    shadowColor: C.accent,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 4},
    elevation: 8,
  },
  loginBtnText: {
    color: '#f5ead0',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  loginBtnArrow: {
    color: '#f5ead0',
    fontSize: 18,
  },
  // .forgot-link
  forgotLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  forgotLinkText: {
    color: C.textSub,
    fontSize: 13,
  },
  // .character-panel
  characterPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    flex: 1,
  },
  // .character-scene
  characterScene: {
    width: 260,
    height: 340,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // .aura base
  aura: {
    position: 'absolute',
    borderRadius: 1000,
  },
  // .aura-1 — 280×340
  aura1: {
    width: 200,
    height: 250,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.15)',
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  // .aura-2 — 340×420
  aura2: {
    width: 240,
    height: 300,
    borderWidth: 1,
    borderColor: 'rgba(160,120,48,0.1)',
    backgroundColor: 'rgba(160,120,48,0.05)',
  },
  // .aura-3 — 420×520
  aura3: {
    width: 260,
    height: 330,
    backgroundColor: 'rgba(100,70,20,0.04)',
  },
  // .character-glow — blur blob debajo de la imagen
  characterGlow: {
    position: 'absolute',
    bottom: 20,
    width: 130,
    height: 200,
    borderRadius: 100,
    backgroundColor: C.glow,
    // blur simulado con shadowColor
    shadowColor: C.accent,
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: {width: 0, height: 0},
  },
  characterImgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  characterEmoji: {
    fontSize: 90,
    textShadowColor: 'rgba(255,215,0,0.8)',
    textShadowRadius: 30,
    textShadowOffset: {width: 0, height: 0},
  },
  characterEmojiGlow: {
    fontSize: 30,
    position: 'absolute',
    top: -10,
    right: -10,
  },
});
