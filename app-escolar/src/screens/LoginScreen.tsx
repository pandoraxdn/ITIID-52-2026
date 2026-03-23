// ============================================
// RUTA: src/screens/LoginScreen.tsx
// ============================================

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
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
  bg:          '#0a0806',
  glass:       'rgba(18,12,6,0.88)',
  glassBorder: 'rgba(192,164,100,0.22)',
  accent:      '#c9a84c',
  accentDark:  '#a07830',
  accentDeep:  '#5c3a08',
  label:       '#c4a87a',
  textSub:     '#a89070',
  inputBg:     'rgba(30,18,6,0.65)',
  inputBorder: 'rgba(192,164,100,0.28)',
  inputFocus:  'rgba(201,168,76,0.65)',
  inputText:   '#f0e8d8',
  placeholder: 'rgba(168,144,112,0.45)',
  glow:        'rgba(201,168,76,0.3)',
};

// ─── Partículas flotantes ─────────────────────────────────────────────────────
interface ParticleData {
  id: number; x: number; size: number;
  duration: number; delay: number; opacity: number;
}

function generateParticles(count = 40): ParticleData[] {
  return Array.from({length: count}, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 4 + 3,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.5 + 0.15,
  }));
}

const Particle = React.memo(({p}: {p: ParticleData}) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1, duration: p.duration * 1000,
        delay: p.delay * 1000, easing: Easing.linear, useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const isSmoke = p.id % 3 === 0;
  return (
    <Animated.View style={{
      position: 'absolute', bottom: 0, left: `${p.x}%` as any,
      width:  isSmoke ? p.size * 2.5 : p.size,
      height: isSmoke ? p.size * 2.5 : p.size,
      borderRadius: isSmoke ? p.size : p.size / 2,
      backgroundColor: isSmoke ? 'rgba(240,230,210,0.08)' : C.accent,
      opacity: anim.interpolate({inputRange: [0, 0.8, 1], outputRange: [p.opacity, p.opacity * 0.6, 0]}),
      transform: [
        {translateY: anim.interpolate({inputRange: [0, 1], outputRange: [0, -H * 1.1]})},
        {scale: anim.interpolate({inputRange: [0, 0.5, 1], outputRange: [1, 1.15, 0.5]})},
      ],
    }} />
  );
});

// ─── CharacterPanel — SIEMPRE ARRIBA ─────────────────────────────────────────
const CharacterPanel = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, {toValue: -12, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(floatAnim, {toValue: 0,   duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, {toValue: 1.07, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(pulseAnim, {toValue: 1,    duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, {toValue: 0.9, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(glowAnim, {toValue: 0.5, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ])).start();
  }, []);

  return (
    <View style={styles.characterPanel}>
      <View style={styles.characterScene}>
        {/* Auras concéntricas */}
        <Animated.View style={[styles.aura, styles.aura3, {transform: [{scale: pulseAnim}]}]} />
        <Animated.View style={[styles.aura, styles.aura2, {transform: [{scale: pulseAnim}]}]} />
        <Animated.View style={[styles.aura, styles.aura1, {transform: [{scale: pulseAnim}]}]} />
        {/* Glow dorado bajo el personaje */}
        <Animated.View style={[styles.characterGlow, {opacity: glowAnim}]} />
        {/* Imagen flotante */}
        <Animated.View style={[styles.characterImgWrap, {transform: [{translateY: floatAnim}]}]}>
          <Image
            source={require('../../assets/pandora.png')}
            style={styles.characterImg}
            resizeMode="contain"
          />
        </Animated.View>
        {/* Mariposas doradas */}
        <SwarmButterflies sceneWidth={260} sceneHeight={280} count={10} scale={0.55} />
      </View>
    </View>
  );
};

// ─── Campo de texto ───────────────────────────────────────────────────────────
const FieldInput = ({label, value, onChange, placeholder, secure = false, icon, delay = 0}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; secure?: boolean; icon: string; delay?: number;
}) => {
  const [focused, setFocused] = useState(false);
  const enterAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1, duration: 480, delay,
      easing: Easing.out(Easing.quad), useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={[
      styles.fieldGroup,
      {
        opacity: enterAnim,
        transform: [{translateY: enterAnim.interpolate({inputRange: [0, 1], outputRange: [12, 0]})}],
      },
    ]}>
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
          autoCorrect={false}
        />
      </View>
    </Animated.View>
  );
};

// ─── Botón de login ───────────────────────────────────────────────────────────
const LoginBtn = ({onPress, title, disabled = false}: {
  onPress: () => void; title: string; disabled?: boolean;
}) => {
  const scale     = useRef(new Animated.Value(1)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1, duration: 480, delay: 650,
      easing: Easing.out(Easing.quad), useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={{
      marginTop: 6,
      opacity: disabled ? 0.6 : enterAnim,
      transform: [
        {scale},
        {translateY: enterAnim.interpolate({inputRange: [0, 1], outputRange: [12, 0]})},
      ],
    }}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={() => Animated.spring(scale, {toValue: 0.97, useNativeDriver: true}).start()}
        onPressOut={() => Animated.spring(scale, {toValue: 1,    useNativeDriver: true}).start()}
        style={styles.loginBtn}
      >
        <Text style={styles.loginBtnText}>{title}</Text>
        <Text style={styles.loginBtnArrow}>→</Text>
      </Pressable>
    </Animated.View>
  );
};

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function LoginScreen({navigation}: {navigation?: any}) {
  const {form, handleInputChange, handleSubmit, loading, loginError} = useLogin();
  const [particles] = useState(() => generateParticles(40));

  const panelAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(panelAnim, {
      toValue: 1, duration: 550, delay: 80,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
  }, []);

  // ── Tras login exitoso, guardarSesion() cambia isAuthenticated en el
  //    AuthContext y el DrawerNavigator monta el Drawer automáticamente.
  //    No se necesita navigation.navigate().
  const onLogin = () => handleSubmit();

  const goBack = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Home');
    }
  };

  return (
    <View style={styles.root}>
      {/* Fondos radiales */}
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      {/* Partículas */}
      <View style={styles.particlesLayer} pointerEvents="none">
        {particles.map(p => <Particle key={p.id} p={p} />)}
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* ── Botón regresar al inicio ── */}
        <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.75}>
          <Text style={styles.backBtnText}>← Inicio</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ══ 1. PERSONAJE — siempre arriba ════════════════════════════ */}
            <CharacterPanel />

            {/* ══ 2. FORMULARIO — siempre debajo ═══════════════════════════ */}
            <Animated.View style={[
              styles.formPanel,
              {
                opacity: panelAnim,
                transform: [{translateY: panelAnim.interpolate({inputRange: [0, 1], outputRange: [24, 0]})}],
              },
            ]}>
              {/* Logo + título */}
              <View style={styles.logoArea}>
                <View style={styles.logoIcon}>
                  <Text style={{fontSize: 24}}>🏛️</Text>
                </View>
                <Text style={styles.brandTitle}>Pandora's Box</Text>
                <Text style={styles.brandSub}>Abre la caja, descubre tu mundo</Text>
              </View>

              <View style={styles.separator} />

              {/* Campos */}
              <View style={styles.loginForm}>
                <FieldInput
                  label="USUARIO"
                  value={form.username}
                  onChange={(v) => handleInputChange('username', v)}
                  placeholder="nombre de usuario"
                  icon="👤"
                  delay={350}
                />
                <FieldInput
                  label="CONTRASEÑA"
                  value={form.password}
                  onChange={(v) => handleInputChange('password', v)}
                  placeholder="••••••••"
                  secure
                  icon="🔑"
                  delay={480}
                />

                {/* Error */}
                {loginError ? (
                  <Text style={styles.errorText}>{loginError}</Text>
                ) : null}

                <LoginBtn
                  title={loading ? 'Verificando...' : 'Iniciar sesión'}
                  onPress={onLogin}
                  disabled={loading}
                />

                <TouchableOpacity style={styles.forgotLink}>
                  <Text style={styles.forgotLinkText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Espacio inferior para el teclado */}
            <View style={{height: 32}} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:         {flex: 1, backgroundColor: C.bg, overflow: 'hidden'},
  bgGlow1:      {
    position: 'absolute',
    width: W * 1.6, height: H * 1.4,
    borderRadius: W * 0.8,
    backgroundColor: '#1e1208',
    top: H * 0.3 - H * 0.7,
    left: W * 0.5 - W * 0.8,
    opacity: 0.65,
  },
  bgGlow2:      {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0a0806', opacity: 0.45,
  },
  particlesLayer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1, overflow: 'hidden',
  },
  safeArea:     {flex: 1, zIndex: 2},
  kav:          {flex: 1},

  // ── Botón regresar ──────────────────────────────────────────────────────────
  backBtn:      {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 8, marginLeft: 16,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20, alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)',
  },
  backBtnText:  {color: C.accent, fontSize: 13, fontWeight: '600'},

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll:       {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // ── Personaje ───────────────────────────────────────────────────────────────
  characterPanel:   {alignItems: 'center', justifyContent: 'center', width: '100%', height: 300},
  characterScene:   {width: 260, height: 280, alignItems: 'center', justifyContent: 'center'},
  aura:             {position: 'absolute', borderRadius: 1000},
  aura1:            {width: 190, height: 230, borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)', backgroundColor: 'rgba(201,168,76,0.07)'},
  aura2:            {width: 225, height: 265, borderWidth: 1, borderColor: 'rgba(160,120,48,0.09)', backgroundColor: 'rgba(160,120,48,0.04)'},
  aura3:            {width: 255, height: 275, backgroundColor: 'rgba(100,70,20,0.03)'},
  characterGlow:    {
    position: 'absolute', bottom: 10,
    width: 120, height: 160, borderRadius: 80,
    backgroundColor: C.glow,
    shadowColor: C.accent, shadowOpacity: 0.55, shadowRadius: 35,
    shadowOffset: {width: 0, height: 0},
  },
  characterImgWrap: {alignItems: 'center', justifyContent: 'center', zIndex: 10},
  characterImg:     {width: 220, height: 220},

  // ── Panel formulario ────────────────────────────────────────────────────────
  formPanel:    {
    width: '100%', maxWidth: 420,
    backgroundColor: C.glass,
    borderRadius: 24, borderWidth: 1, borderColor: C.glassBorder,
    paddingHorizontal: 24, paddingVertical: 28,
    gap: 14,
    shadowColor: C.accent, shadowOpacity: 0.18,
    shadowRadius: 36, shadowOffset: {width: 0, height: 6},
    elevation: 14,
  },
  logoArea:     {alignItems: 'center', gap: 6},
  logoIcon:     {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.35)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.accent, shadowOpacity: 0.22, shadowRadius: 18,
    marginBottom: 2,
  },
  brandTitle:   {
    fontSize: 24, fontWeight: '900', color: C.accent,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(201,168,76,0.4)',
    textShadowRadius: 10, textShadowOffset: {width: 0, height: 0},
  },
  brandSub:     {fontSize: 12, color: C.textSub},
  separator:    {height: 1, backgroundColor: C.glassBorder, marginVertical: 2},

  // ── Formulario ──────────────────────────────────────────────────────────────
  loginForm:        {gap: 4},
  fieldGroup:       {marginBottom: 12},
  fieldLabel:       {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.5,
    textTransform: 'uppercase', color: C.label, marginBottom: 6,
  },
  fieldWrap:        {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.inputBg, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.inputBorder,
  },
  fieldWrapFocused: {
    borderColor: C.inputFocus,
    shadowColor: C.accent, shadowOpacity: 0.16,
    shadowRadius: 14, shadowOffset: {width: 0, height: 0},
  },
  fieldIcon:    {paddingLeft: 13, fontSize: 14, color: C.textSub},
  fieldInput:   {flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 15},
  loginBtn:     {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: C.accentDark,
    borderWidth: 1, borderColor: C.accentDeep,
    shadowColor: C.accent, shadowOpacity: 0.32,
    shadowRadius: 18, shadowOffset: {width: 0, height: 4},
    elevation: 8,
  },
  loginBtnText:  {color: '#f5ead0', fontSize: 16, fontWeight: '700', letterSpacing: 0.3},
  loginBtnArrow: {color: '#f5ead0', fontSize: 18},
  forgotLink:    {alignItems: 'center', marginTop: 10},
  forgotLinkText:{color: C.textSub, fontSize: 13},
  errorText:     {
    color: '#e06060', fontSize: 13, textAlign: 'center',
    marginBottom: 2, fontWeight: '500',
  },
});
