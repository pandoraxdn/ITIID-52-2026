// ============================================
// RUTA: src/screens/home/sections/AdmissionsSection.tsx
// ============================================

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

const steps = [
  {icon: '📋', step: 1, title: 'Solicitud',      desc: 'Completa el formulario de solicitud de admisión en línea o en nuestras oficinas.'},
  {icon: '📄', step: 2, title: 'Documentación',  desc: 'Entrega los documentos: acta de nacimiento, CURP, boletas anteriores y fotografías.'},
  {icon: '✅', step: 3, title: 'Evaluación',     desc: 'Evaluación diagnóstica del alumno y entrevista con los padres de familia.'},
  {icon: '🎉', step: 4, title: 'Inscripción',    desc: 'Una vez aprobado, formaliza la inscripción y recibe la información de inicio de clases.'},
];

interface Props { onContacto: () => void; }

export const AdmissionsSection = ({onContacto}: Props) => {
  const {isDark} = useTheme();
  const C = colors(isDark);

  return (
    <View style={[styles.section, {backgroundColor: C.bg}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: C.text}]}>Admisiones</Text>
        <Text style={[styles.subtitle, {color: C.muted}]}>
          El proceso de admisión del Centro Educativo Pandora es sencillo y transparente.
          Sigue estos pasos para formar parte de nuestra comunidad.
        </Text>
      </View>

      <View style={styles.steps}>
        {steps.map((s, i) => (
          <View key={s.title} style={styles.stepRow}>
            {/* Línea vertical conectora */}
            {i < steps.length - 1 && (
              <View style={[styles.connector, {backgroundColor: C.border}]} />
            )}
            <View style={[styles.stepCircle, {backgroundColor: '#c9a84c'}]}>
              <Text style={styles.stepIcon}>{s.icon}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepNum, {color: '#c9a84c'}]}>Paso {s.step}</Text>
              <Text style={[styles.stepTitle, {color: C.text}]}>{s.title}</Text>
              <Text style={[styles.stepDesc,  {color: C.muted}]}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={onContacto} activeOpacity={0.8}>
        <Text style={styles.btnText}>Solicitar Información</Text>
      </TouchableOpacity>
    </View>
  );
};

const colors = (isDark: boolean) => ({
  bg:     isDark ? '#111009' : '#f7f5f2',
  border: isDark ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.35)',
  text:   isDark ? '#f0ebe0' : '#2a1f0e',
  muted:  isDark ? '#a89070' : '#6b5a47',
});

const styles = StyleSheet.create({
  section:      {paddingVertical: 48, paddingHorizontal: 20, gap: 28},
  header:       {alignItems: 'center', gap: 12},
  title:        {fontSize: 26, fontWeight: '800', textAlign: 'center'},
  subtitle:     {fontSize: 14, textAlign: 'center', lineHeight: 22},
  steps:        {gap: 0},
  stepRow:      {flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 24, position: 'relative'},
  connector:    {position: 'absolute', left: 27, top: 56, width: 2, height: 28, borderRadius: 1},
  stepCircle:   {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#c9a84c', shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
    flexShrink: 0,
  },
  stepIcon:     {fontSize: 24},
  stepContent:  {flex: 1, paddingTop: 4, gap: 4},
  stepNum:      {fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1},
  stepTitle:    {fontSize: 17, fontWeight: '700'},
  stepDesc:     {fontSize: 13, lineHeight: 20},
  btn:          {
    alignItems: 'center', paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#c9a84c',
    backgroundColor: 'rgba(201,168,76,0.1)',
  },
  btnText:      {color: '#c9a84c', fontWeight: '700', fontSize: 15},
});
