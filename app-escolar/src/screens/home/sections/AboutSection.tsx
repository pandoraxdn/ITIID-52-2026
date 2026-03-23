// ============================================
// RUTA: src/screens/home/sections/AboutSection.tsx
// ============================================

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

const values = [
  {icon: '📖', title: 'Excelencia Académica',   desc: 'Programas rigurosos y actualizados que preparan a nuestros estudiantes para los retos del futuro.'},
  {icon: '❤️',  title: 'Valores Humanos',         desc: 'Fomentamos el respeto, la responsabilidad y la empatía como pilares de la formación integral.'},
  {icon: '💡', title: 'Innovación Educativa',    desc: 'Incorporamos tecnología y metodologías modernas para un aprendizaje significativo.'},
  {icon: '🏆', title: 'Desarrollo Integral',     desc: 'Actividades deportivas, artísticas y culturales que complementan la formación académica.'},
];

export const AboutSection = () => {
  const {isDark} = useTheme();
  const C = colors(isDark);

  return (
    <View style={[styles.section, {backgroundColor: C.sectionBg}]}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: C.text}]}>Conócenos</Text>
        <Text style={[styles.subtitle, {color: C.muted}]}>
          Desde nuestra fundación, el Centro Educativo Pandora se ha dedicado a brindar
          una educación de calidad con calidez humana. Nuestra comunidad educativa trabaja
          día a día para formar ciudadanos íntegros, críticos y comprometidos.
        </Text>
      </View>

      {/* Misión / Visión */}
      <View style={styles.row}>
        <View style={[styles.card, {backgroundColor: C.card, borderColor: C.border, flex: 1}]}>
          <Text style={[styles.cardTitle, {color: C.accent}]}>Nuestra Misión</Text>
          <Text style={[styles.cardDesc, {color: C.muted}]}>
            Formar estudiantes competentes, creativos y con sólidos valores éticos a través
            de una educación integral.
          </Text>
        </View>
        <View style={[styles.card, {backgroundColor: C.card, borderColor: C.border, flex: 1}]}>
          <Text style={[styles.cardTitle, {color: C.accent}]}>Nuestra Visión</Text>
          <Text style={[styles.cardDesc, {color: C.muted}]}>
            Ser reconocidos como una institución educativa líder en innovación pedagógica
            y excelencia académica.
          </Text>
        </View>
      </View>

      {/* Valores */}
      <View style={styles.grid}>
        {values.map((v) => (
          <View key={v.title} style={[styles.valueCard, {backgroundColor: C.card, borderColor: C.border}]}>
            <Text style={styles.valueIcon}>{v.icon}</Text>
            <Text style={[styles.valueTitle, {color: C.text}]}>{v.title}</Text>
            <Text style={[styles.valueDesc,  {color: C.muted}]}>{v.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const colors = (isDark: boolean) => ({
  sectionBg: isDark ? '#111009' : '#f7f5f2',
  card:      isDark ? '#1a1710' : '#ffffff',
  border:    isDark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.25)',
  text:      isDark ? '#f0ebe0' : '#2a1f0e',
  muted:     isDark ? '#a89070' : '#6b5a47',
  accent:    '#c9a84c',
});

const styles = StyleSheet.create({
  section:    {paddingVertical: 48, paddingHorizontal: 20, gap: 24},
  header:     {alignItems: 'center', gap: 12},
  title:      {fontSize: 26, fontWeight: '800', textAlign: 'center'},
  subtitle:   {fontSize: 14, textAlign: 'center', lineHeight: 22},
  row:        {flexDirection: 'row', gap: 12},
  card:       {padding: 18, borderRadius: 14, borderWidth: 1, gap: 8},
  cardTitle:  {fontSize: 15, fontWeight: '700'},
  cardDesc:   {fontSize: 13, lineHeight: 20},
  grid:       {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  valueCard:  {
    width: '47%', padding: 16, borderRadius: 14, borderWidth: 1,
    alignItems: 'center', gap: 8,
  },
  valueIcon:  {fontSize: 28},
  valueTitle: {fontSize: 13, fontWeight: '700', textAlign: 'center'},
  valueDesc:  {fontSize: 12, textAlign: 'center', lineHeight: 18},
});
