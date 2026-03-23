// ============================================
// RUTA: src/screens/home/sections/FooterSection.tsx
// ============================================

import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

const pandoraLogo = require('../../../../assets/pandora.png');

const links = [
  {label: 'Inicio',            id: 'hero'},
  {label: 'Conócenos',         id: 'about'},
  {label: 'Oferta Académica',  id: 'offer'},
  {label: 'Admisiones',        id: 'admissions'},
  {label: 'Noticias',          id: 'news'},
  {label: 'Contacto',          id: 'contact'},
];

interface Props {
  onNavigate: (id: string) => void;
}

export const FooterSection = ({onNavigate}: Props) => {
  const {isDark} = useTheme();
  const C = colors(isDark);

  return (
    <View style={[styles.footer, {backgroundColor: C.bg, borderTopColor: C.border}]}>
      {/* Logo y descripción */}
      <View style={styles.brand}>
        <Image source={pandoraLogo} style={styles.logo} />
        <View style={{flex: 1}}>
          <Text style={[styles.brandName, {color: C.text}]}>Centro Educativo Pandora</Text>
          <Text style={[styles.brandDesc, {color: C.muted}]}>
            Formando estudiantes íntegros con excelencia académica y valores humanos.
          </Text>
        </View>
      </View>

      {/* Separador */}
      <View style={[styles.sep, {backgroundColor: C.border}]} />

      {/* Links rápidos */}
      <View style={styles.linksGrid}>
        {links.map((l) => (
          <TouchableOpacity key={l.id} onPress={() => onNavigate(l.id)} activeOpacity={0.7}>
            <Text style={[styles.link, {color: C.muted}]}>{l.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Separador */}
      <View style={[styles.sep, {backgroundColor: C.border}]} />

      {/* Contacto rápido */}
      <View style={styles.contactInfo}>
        <Text style={[styles.contactText, {color: C.muted}]}>📍 Av. Educación #123, Col. Centro</Text>
        <Text style={[styles.contactText, {color: C.muted}]}>📞 (55) 1234-5678</Text>
        <Text style={[styles.contactText, {color: C.muted}]}>✉️ contacto@cepandora.edu.mx</Text>
      </View>

      {/* Copyright */}
      <Text style={[styles.copy, {color: C.muted}]}>
        © {new Date().getFullYear()} Centro Educativo Pandora. Todos los derechos reservados.
      </Text>
    </View>
  );
};

const colors = (isDark: boolean) => ({
  bg:     isDark ? '#0a0806' : '#faf9f7',
  border: isDark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.25)',
  text:   isDark ? '#f0ebe0' : '#2a1f0e',
  muted:  isDark ? '#7a6a50' : '#8a7a65',
});

const styles = StyleSheet.create({
  footer:      {paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24, gap: 20, borderTopWidth: 1},
  brand:       {flexDirection: 'row', alignItems: 'center', gap: 14},
  logo:        {width: 44, height: 44, borderRadius: 22},
  brandName:   {fontSize: 15, fontWeight: '700', marginBottom: 4},
  brandDesc:   {fontSize: 12, lineHeight: 18},
  sep:         {height: 1},
  linksGrid:   {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  link:        {fontSize: 13, fontWeight: '500'},
  contactInfo: {gap: 6},
  contactText: {fontSize: 12},
  copy:        {fontSize: 11, textAlign: 'center'},
});
