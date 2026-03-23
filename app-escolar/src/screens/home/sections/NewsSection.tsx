// ============================================
// RUTA: src/screens/home/sections/NewsSection.tsx
// ============================================

import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

const news = [
  {title: 'Inscripciones Abiertas 2026-2027', date: '15 Feb 2026', desc: '¡Ya están abiertas las inscripciones para el próximo ciclo escolar. Asegura tu lugar!', tag: 'Admisiones',  tagColor: '#c9a84c'},
  {title: 'Feria de Ciencias y Tecnología',   date: '28 Mar 2026', desc: 'Nuestros alumnos presentarán proyectos innovadores en la feria anual de ciencias.',    tag: 'Evento',      tagColor: '#4c9ac9'},
  {title: 'Torneo Deportivo Interescolar',    date: '10 Abr 2026', desc: 'Pandora será sede del torneo interescolar de fútbol, basquetbol y atletismo.',          tag: 'Deportes',    tagColor: '#4cc97a'},
  {title: 'Taller de Arte y Cultura',         date: '05 May 2026', desc: 'Nuevos talleres de pintura, música y teatro disponibles para todos los niveles.',        tag: 'Cultura',     tagColor: '#c94c9a'},
];

export const NewsSection = () => {
  const {isDark} = useTheme();
  const C = colors(isDark);

  return (
    <View style={[styles.section, {backgroundColor: C.bg}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: C.text}]}>Noticias y Eventos</Text>
        <Text style={[styles.subtitle, {color: C.muted}]}>
          Mantente al día con las últimas novedades y eventos del Centro Educativo Pandora.
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {news.map((n) => (
          <View key={n.title} style={[styles.card, {backgroundColor: C.card, borderColor: C.border}]}>
            {/* Franja de color en el tope */}
            <View style={[styles.topBar, {backgroundColor: n.tagColor}]} />
            <View style={styles.cardBody}>
              {/* Tag */}
              <View style={[styles.tag, {backgroundColor: n.tagColor + '22'}]}>
                <Text style={[styles.tagText, {color: n.tagColor}]}>{n.tag}</Text>
              </View>
              <Text style={[styles.cardTitle, {color: C.text}]}>{n.title}</Text>
              <Text style={[styles.cardDesc,  {color: C.muted}]}>{n.desc}</Text>
              <View style={styles.dateRow}>
                <Text style={styles.dateIcon}>📅</Text>
                <Text style={[styles.dateText, {color: C.muted}]}>{n.date}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const colors = (isDark: boolean) => ({
  bg:     isDark ? '#0a0806' : '#ffffff',
  card:   isDark ? '#1a1710' : '#faf9f7',
  border: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
  text:   isDark ? '#f0ebe0' : '#2a1f0e',
  muted:  isDark ? '#a89070' : '#6b5a47',
});

const styles = StyleSheet.create({
  section:   {paddingVertical: 48, gap: 24},
  header:    {alignItems: 'center', gap: 12, paddingHorizontal: 20},
  title:     {fontSize: 26, fontWeight: '800', textAlign: 'center'},
  subtitle:  {fontSize: 14, textAlign: 'center', lineHeight: 22},
  scroll:    {paddingHorizontal: 20, gap: 14, paddingVertical: 4},
  card:      {
    width: 240, borderRadius: 14, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  topBar:    {height: 4, width: '100%'},
  cardBody:  {padding: 16, gap: 10},
  tag:       {alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999},
  tagText:   {fontSize: 11, fontWeight: '700'},
  cardTitle: {fontSize: 15, fontWeight: '700', lineHeight: 20},
  cardDesc:  {fontSize: 13, lineHeight: 19},
  dateRow:   {flexDirection: 'row', alignItems: 'center', gap: 6},
  dateIcon:  {fontSize: 12},
  dateText:  {fontSize: 12},
});
