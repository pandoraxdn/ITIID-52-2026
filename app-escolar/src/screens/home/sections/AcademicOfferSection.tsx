// ============================================
// RUTA: src/screens/home/sections/AcademicOfferSection.tsx
// Los <Tabs> del web se reemplazan por un selector horizontal scrollable.
// ============================================

import React, {useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

const levels = [
  {
    id: 'inicial', label: 'Inicial', icon: '👶',
    ages: '0 – 3 años',
    desc: 'Estimulación temprana y desarrollo psicomotriz en un ambiente seguro, cálido y lúdico que potencia las habilidades naturales de cada niño.',
    features: ['Estimulación temprana', 'Desarrollo sensorial', 'Psicomotricidad', 'Socialización'],
  },
  {
    id: 'preescolar', label: 'Preescolar', icon: '🎨',
    ages: '3 – 6 años',
    desc: 'Aprendizaje a través del juego y la exploración, desarrollando las bases cognitivas, sociales y emocionales para el ingreso a primaria.',
    features: ['Lectoescritura inicial', 'Pensamiento lógico', 'Expresión artística', 'Inglés básico'],
  },
  {
    id: 'primaria', label: 'Primaria', icon: '📚',
    ages: '6 – 12 años',
    desc: 'Formación académica sólida con enfoque en competencias clave, fomentando la curiosidad, el pensamiento crítico y el trabajo colaborativo.',
    features: ['Programa bilingüe', 'Ciencias y tecnología', 'Deportes', 'Valores y civismo'],
  },
  {
    id: 'secundaria', label: 'Secundaria', icon: '🔬',
    ages: '12 – 15 años',
    desc: 'Preparación académica rigurosa que fortalece el razonamiento analítico, la investigación y las habilidades socioemocionales.',
    features: ['Laboratorios de ciencias', 'Talleres tecnológicos', 'Orientación vocacional', 'Actividades culturales'],
  },
  {
    id: 'preparatoria', label: 'Preparatoria', icon: '🎓',
    ages: '15 – 18 años',
    desc: 'Formación preuniversitaria integral con áreas de especialización que prepara a los estudiantes para la educación superior.',
    features: ['Áreas de especialización', 'Preparación universitaria', 'Proyectos de investigación', 'Servicio social'],
  },
];

export const AcademicOfferSection = () => {
  const [selected, setSelected] = useState('inicial');
  const {isDark} = useTheme();
  const C = colors(isDark);
  const level = levels.find((l) => l.id === selected)!;

  return (
    <View style={[styles.section, {backgroundColor: C.bg}]}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: C.text}]}>Oferta Académica</Text>
        <Text style={[styles.subtitle, {color: C.muted}]}>
          Acompañamos a nuestros estudiantes en cada etapa de su desarrollo
          con programas diseñados para su edad y necesidades.
        </Text>
      </View>

      {/* Selector horizontal (reemplaza los Tabs del web) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContent}>
        {levels.map((l) => {
          const active = selected === l.id;
          return (
            <TouchableOpacity
              key={l.id}
              onPress={() => setSelected(l.id)}
              style={[styles.tab, {
                backgroundColor: active ? '#c9a84c' : C.card,
                borderColor: active ? '#c9a84c' : C.border,
              }]}
              activeOpacity={0.75}
            >
              <Text style={styles.tabIcon}>{l.icon}</Text>
              <Text style={[styles.tabLabel, {color: active ? '#0a0806' : C.text}]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Contenido del nivel seleccionado */}
      <View style={[styles.card, {backgroundColor: C.card, borderColor: C.border}]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBadge, {backgroundColor: 'rgba(201,168,76,0.15)'}]}>
            <Text style={styles.cardIcon}>{level.icon}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.cardTitle, {color: C.text}]}>{level.label}</Text>
            <Text style={[styles.cardAges, {color: '#c9a84c'}]}>{level.ages}</Text>
          </View>
        </View>

        <Text style={[styles.cardDesc, {color: C.muted}]}>{level.desc}</Text>

        <View style={styles.features}>
          {level.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={[styles.featureDot, {backgroundColor: '#c9a84c'}]} />
              <Text style={[styles.featureText, {color: C.text}]}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const colors = (isDark: boolean) => ({
  bg:    isDark ? '#0a0806' : '#ffffff',
  card:  isDark ? '#1a1710' : '#faf9f7',
  border: isDark ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.3)',
  text:  isDark ? '#f0ebe0' : '#2a1f0e',
  muted: isDark ? '#a89070' : '#6b5a47',
});

const styles = StyleSheet.create({
  section:     {paddingVertical: 48, gap: 24},
  header:      {alignItems: 'center', gap: 12, paddingHorizontal: 20},
  title:       {fontSize: 26, fontWeight: '800', textAlign: 'center'},
  subtitle:    {fontSize: 14, textAlign: 'center', lineHeight: 22},
  tabScroll:   {flexGrow: 0},
  tabContent:  {paddingHorizontal: 20, gap: 10, paddingVertical: 4},
  tab:         {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 1.5,
  },
  tabIcon:     {fontSize: 16},
  tabLabel:    {fontSize: 13, fontWeight: '600'},
  card:        {
    marginHorizontal: 20, borderRadius: 16, borderWidth: 1,
    padding: 20, gap: 14,
  },
  cardHeader:  {flexDirection: 'row', alignItems: 'center', gap: 14},
  iconBadge:   {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  cardIcon:    {fontSize: 26},
  cardTitle:   {fontSize: 20, fontWeight: '800'},
  cardAges:    {fontSize: 13, fontWeight: '600', marginTop: 2},
  cardDesc:    {fontSize: 14, lineHeight: 22},
  features:    {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  featureRow:  {flexDirection: 'row', alignItems: 'center', gap: 8, width: '45%'},
  featureDot:  {width: 8, height: 8, borderRadius: 4},
  featureText: {fontSize: 13, fontWeight: '500'},
});
