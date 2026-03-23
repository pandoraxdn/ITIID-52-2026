// ============================================
// RUTA: src/screens/HomeScreen.tsx
// PROPÓSITO: Pantalla de inicio pública — equivalente a la ruta "/" del web.
//            Contiene el Header sticky, todas las secciones con scroll
//            y navegación interna por anclas (refs a cada sección).
// ============================================

import React, {useRef} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

import {HomeHeader}          from './home/components/HomeHeader';
import {HeroSection}         from './home/sections/HeroSection';
import {AboutSection}        from './home/sections/AboutSection';
import {AcademicOfferSection} from './home/sections/AcademicOfferSection';
import {AdmissionsSection}   from './home/sections/AdmissionsSection';
import {NewsSection}         from './home/sections/NewsSection';
import {ContactSection}      from './home/sections/ContactSection';
import {FooterSection}       from './home/sections/FooterSection';

// Mapa de anclas → posición Y en el ScrollView
// Se rellena dinámicamente con onLayout de cada sección
type SectionKey = 'hero' | 'about' | 'offer' | 'admissions' | 'news' | 'contact';

export default function HomeScreen() {
  const {isDark} = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  // Guardamos la posición Y de cada sección
  const offsets = useRef<Record<string, number>>({
    hero: 0, about: 0, offer: 0, admissions: 0, news: 0, contact: 0,
  });

  const scrollTo = (id: string) => {
    const y = offsets.current[id] ?? 0;
    scrollRef.current?.scrollTo({y, animated: true});
  };

  return (
    <View style={[styles.root, {backgroundColor: isDark ? '#0a0806' : '#faf9f7'}]}>
      {/* ── Header sticky ─────────────────────────────────────────────── */}
      <HomeHeader onNavigate={scrollTo} />

      {/* ── Scroll principal ──────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <View onLayout={(e) => { offsets.current.hero = e.nativeEvent.layout.y; }}>
          <HeroSection
            onAdmisiones={() => scrollTo('admissions')}
            onConocenos={() => scrollTo('about')}
          />
        </View>

        {/* Conócenos */}
        <View onLayout={(e) => { offsets.current.about = e.nativeEvent.layout.y; }}>
          <AboutSection />
        </View>

        {/* Oferta Académica */}
        <View onLayout={(e) => { offsets.current.offer = e.nativeEvent.layout.y; }}>
          <AcademicOfferSection />
        </View>

        {/* Admisiones */}
        <View onLayout={(e) => { offsets.current.admissions = e.nativeEvent.layout.y; }}>
          <AdmissionsSection onContacto={() => scrollTo('contact')} />
        </View>

        {/* Noticias */}
        <View onLayout={(e) => { offsets.current.news = e.nativeEvent.layout.y; }}>
          <NewsSection />
        </View>

        {/* Contacto */}
        <View onLayout={(e) => { offsets.current.contact = e.nativeEvent.layout.y; }}>
          <ContactSection />
        </View>

        {/* Footer */}
        <FooterSection onNavigate={scrollTo} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});
