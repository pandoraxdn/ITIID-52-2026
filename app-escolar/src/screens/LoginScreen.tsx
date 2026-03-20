// ============================================
// RUTA: src/screens/LoginScreen.tsx
// PROPÓSITO: Pantalla de login. Solo estructura visual.
//            La lógica vive en src/hooks/useLogin.ts
// ============================================

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SwarmButterflies} from '@/components/SwarmButterflies';
import {useLogin} from '@/hooks/useLogin';

const {width: W, height: H} = Dimensions.get('window');

const C = {
  bg: '#0a0806',
  glass: 'rgba(18,12,6,0.82)',
  glassBorder: 'rgba(192,164,100,0.22)',
  accent: '#c9a84c',
  accentDark: '#a07830',
  accentDeep: '#5c3a08',
  label: '#c4a87a',
  textSub: '#a89070',
  inputBg: 'rgba(30,18,6,0.65)',
  inputBorder: 'rgba(192,164,100,0.28)',
  inputFocus: 'rgba(201,168,76,0.65)',
  inputText: '#f0e8d8',
  placeholder: 'rgba(168,144,112,0.45)',
  glow: 'rgba(201,168,76,0.3)',
};

// ─── Partículas ───────────────────────────────────────────────────────────────
interface ParticleData {
  id: number; x: number; size: number;
  duration: number; delay: number; opacity: number;
}

function generateParticles(count = 55): ParticleData[] {
  return Array.from({length: count}, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 4 + 4,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.6 + 0.2,
  }));
}

const Particle = React.memo(({p}: {p: ParticleData}) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {toValue: 1, duration: p.duration * 1000, delay: p.delay * 1000, easing: Easing.linear, useNativeDriver: true})
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const isSmoke = p.id % 3 === 0;
  return (
    <Animated.View style={{
      position: 'absolute', bottom: 0, left: `${p.x}%` as any,
      width: isSmoke ? p.size * 2.5 : p.size, height: isSmoke ? p.size * 2.5 : p.size,
      borderRadius: isSmoke ? p.size : p.size / 2,
      backgroundColor: isSmoke ? 'rgba(240,230,210,0.1)' : C.accent,
      opacity: anim.interpolate({inputRange: [0, 0.8, 1], outputRange: [p.opacity, p.opacity * 0.7, 0]}),
      transform: [
        {translateY: anim.interpolate({inputRange: [0, 1], outputRange: [0, -H * 1.1]})},
        {scale: anim.interpolate({inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 0.5]})},
      ],
    }} />
  );
});

// ─── LogoArea ─────────────────────────────────────────────────────────────────
const LogoArea = () => (
  <View style={styles.logoArea}>
    <View style={styles.logoIcon}>
      <Text style={{fontSize: 26}}>🏛️</Text>
    </View>
    <Text style={styles.brandTitle}>Pandora's Box</Text>
    <Text style={styles.brandSub}>Abre la caja, descubre tu mundo</Text>
  </View>
);

// ─── FieldInput ───────────────────────────────────────────────────────────────
const FieldInput = ({label, value, onChange, placeholder, secure = false, icon, delay = 0}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; secure?: boolean; icon: string; delay?: number;
}) => {
  const [focused, setFocused] = useState(false);
  const enterAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enterAnim, {toValue: 1, duration: 500, delay, easing: Easing.out(Easing.quad), useNativeDriver: true}).start();
  }, []);
  return (
    <Animated.View style={[styles.fieldGroup, {opacity: enterAnim, transform: [{translateY: enterAnim.interpolate({inputRange: [0, 1], outputRange: [14, 0]})}]}]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldWrap, focused && styles.fieldWrapFocused]}>
        <Text style={[styles.fieldIcon, focused && {color: C.accent}]}>{icon}</Text>
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
        />
      </View>
    </Animated.View>
  );
};

// ─── LoginBtn ─────────────────────────────────────────────────────────────────
const LoginBtn = ({onPress, title, disabled = false}: {onPress: () => void; title: string; disabled?: boolean}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enterAnim, {toValue: 1, duration: 500, delay: 700, easing: Easing.out(Easing.quad), useNativeDriver: true}).start();
  }, []);
  return (
    <Animated.View style={{marginTop: 8, opacity: disabled ? 0.6 : enterAnim, transform: [{scale}, {translateY: enterAnim.interpolate({inputRange: [0, 1], outputRange: [14, 0]})}]}}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={() => Animated.spring(scale, {toValue: 0.97, useNativeDriver: true}).start()}
        onPressOut={() => Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start()}
        style={styles.loginBtn}
      >
        <Text style={styles.loginBtnText}>{title}</Text>
        <Text style={styles.loginBtnArrow}>→</Text>
      </Pressable>
    </Animated.View>
  );
};

// ─── CharacterPanel ───────────────────────────────────────────────────────────
const CharacterPanel = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, {toValue: -15, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(floatAnim, {toValue: 0,   duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, {toValue: 1.08, duration: 1750, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(pulseAnim, {toValue: 1,    duration: 1750, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, {toValue: 0.9, duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(glowAnim, {toValue: 0.5, duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();
  }, []);
  return (
    <View style={styles.characterPanel}>
      <View style={styles.characterScene}>
        <Animated.View style={[styles.aura, styles.aura3, {transform: [{scale: pulseAnim}]}]} />
        <Animated.View style={[styles.aura, styles.aura2, {transform: [{scale: pulseAnim}]}]} />
        <Animated.View style={[styles.aura, styles.aura1, {transform: [{scale: pulseAnim}]}]} />
        <Animated.View style={[styles.characterGlow, {opacity: glowAnim}]} />
        <Animated.View style={[styles.characterImgWrap, {transform: [{translateY: floatAnim}]}]}>
          <Image source={require('../../assets/pandora.png')} style={{width: 250, height: 250}} />
        </Animated.View>
        <SwarmButterflies sceneWidth={260} sceneHeight={340} count={12} scale={0.6} />
      </View>
    </View>
  );
};

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function LoginScreen({navigation}: {navigation?: any}) {

  // useLogin contiene toda la lógica: estado del form, llamada a API, errores
  const {form, handleInputChange, handleSubmit, loading, loginError} = useLogin();

  const [particles] = useState(() => generateParticles(55));
  const panelAnim = useRef(new Animated.Value(0)).current;
  const isNarrow = W < 600;

  useEffect(() => {
    Animated.timing(panelAnim, {toValue: 1, duration: 600, delay: 100, easing: Easing.out(Easing.cubic), useNativeDriver: true}).start();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.bgGradient1} />
      <View style={styles.bgGradient2} />

      <View style={styles.particlesContainer} pointerEvents="none">
        {particles.map(p => <Particle key={p.id} p={p} />)}
      </View>

      <ScrollView
        contentContainerStyle={[styles.loginLayout, isNarrow ? styles.loginLayoutNarrow : styles.loginLayoutWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isNarrow && <CharacterPanel />}

        <Animated.View style={[
          styles.formPanel,
          isNarrow ? styles.formPanelNarrow : styles.formPanelWide,
          {opacity: panelAnim, transform: [{translateX: panelAnim.interpolate({inputRange: [0, 1], outputRange: [-30, 0]})}]},
        ]}>
          <LogoArea />
          <View style={styles.separator} />

          <View style={styles.loginForm}>
            <FieldInput
              label="Usuario"
              value={form.username}
              onChange={(v) => handleInputChange('username', v)}
              placeholder="nombre de usuario"
              icon="👤"
              delay={400}
            />
            <FieldInput
              label="Contraseña"
              value={form.password}
              onChange={(v) => handleInputChange('password', v)}
              placeholder="••••••••"
              secure
              icon="🔑"
              delay={550}
            />

            {/* Mensaje de error — solo visible si hay error */}
            {loginError ? (
              <Text style={styles.errorText}>{loginError}</Text>
            ) : null}

            <LoginBtn
              title={loading ? 'Verificando...' : 'Iniciar sesión'}
              onPress={() => handleSubmit(() => navigation?.navigate('Empleados'))}
              disabled={loading}
            />

            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.forgotLinkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {!isNarrow && <CharacterPanel />}
      </ScrollView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.bg, overflow: 'hidden'},
  bgGradient1: {position: 'absolute', width: W * 1.4, height: H * 1.4, borderRadius: W * 0.7, backgroundColor: '#1e1208', top: H * 0.55 - H * 0.7, left: W * 0.65 - W * 0.7, opacity: 0.7},
  bgGradient2: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0a0806', opacity: 0.5},
  particlesContainer: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, overflow: 'hidden'},
  loginLayout: {flexGrow: 1, zIndex: 2, alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16},
  loginLayoutWide: {flexDirection: 'row', justifyContent: 'center', minHeight: H, gap: 24},
  loginLayoutNarrow: {flexDirection: 'column', gap: 20},
  formPanel: {backgroundColor: C.glass, borderRadius: 24, borderWidth: 1, borderColor: C.glassBorder, padding: 32, shadowColor: C.accent, shadowOpacity: 0.2, shadowRadius: 40, shadowOffset: {width: 0, height: 8}, elevation: 16, gap: 16},
  formPanelWide: {maxWidth: 460, flex: 1, alignSelf: 'center', margin: 16},
  formPanelNarrow: {width: '100%', maxWidth: 420, alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 28},
  logoArea: {alignItems: 'center', gap: 6},
  logoIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(201,168,76,0.1)', borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.35)', alignItems: 'center', justifyContent: 'center', shadowColor: C.accent, shadowOpacity: 0.25, shadowRadius: 22, marginBottom: 4},
  brandTitle: {fontSize: 26, fontWeight: '900', color: C.accent, letterSpacing: -0.5, textShadowColor: 'rgba(201,168,76,0.4)', textShadowRadius: 12, textShadowOffset: {width: 0, height: 0}},
  brandSub: {fontSize: 13, color: C.textSub},
  separator: {height: 1, backgroundColor: C.glassBorder, marginVertical: 4},
  loginForm: {gap: 4},
  fieldGroup: {marginBottom: 14},
  fieldLabel: {fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: C.label, marginBottom: 6},
  fieldWrap: {flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 12, borderWidth: 1.5, borderColor: C.inputBorder},
  fieldWrapFocused: {borderColor: C.inputFocus, shadowColor: C.accent, shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: {width: 0, height: 0}},
  fieldIcon: {paddingLeft: 14, fontSize: 15, color: C.textSub},
  fieldInput: {flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 15},
  loginBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14, backgroundColor: C.accentDark, borderWidth: 1, borderColor: C.accentDeep, shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: {width: 0, height: 4}, elevation: 8},
  loginBtnText: {color: '#f5ead0', fontSize: 16, fontWeight: '700', letterSpacing: 0.4},
  loginBtnArrow: {color: '#f5ead0', fontSize: 18},
  forgotLink: {alignItems: 'center', marginTop: 10},
  forgotLinkText: {color: C.textSub, fontSize: 13},
  errorText: {color: '#e55', fontSize: 13, textAlign: 'center', marginBottom: 4},
  characterPanel: {alignItems: 'center', justifyContent: 'center', minHeight: 280, flex: 1},
  characterScene: {width: 260, height: 340, alignItems: 'center', justifyContent: 'center'},
  aura: {position: 'absolute', borderRadius: 1000},
  aura1: {width: 200, height: 250, borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)', backgroundColor: 'rgba(201,168,76,0.08)'},
  aura2: {width: 240, height: 300, borderWidth: 1, borderColor: 'rgba(160,120,48,0.1)', backgroundColor: 'rgba(160,120,48,0.05)'},
  aura3: {width: 260, height: 330, backgroundColor: 'rgba(100,70,20,0.04)'},
  characterGlow: {position: 'absolute', bottom: 20, width: 130, height: 200, borderRadius: 100, backgroundColor: C.glow, shadowColor: C.accent, shadowOpacity: 0.6, shadowRadius: 40, shadowOffset: {width: 0, height: 0}},
  characterImgWrap: {alignItems: 'center', justifyContent: 'center', zIndex: 10},
});
