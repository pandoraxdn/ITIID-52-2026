// ============================================
// RUTA: src/screens/home/sections/ContactSection.tsx
// ============================================

import React, {useState} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, Linking, StyleSheet,
} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

const infoItems = [
  {icon: '📍', label: 'Dirección', value: 'Av. Educación #123, Col. Centro, Ciudad, CP 12345'},
  {icon: '📞', label: 'Teléfono',  value: '(55) 1234-5678',    action: () => Linking.openURL('tel:5512345678')},
  {icon: '✉️',  label: 'Correo',    value: 'contacto@cepandora.edu.mx', action: () => Linking.openURL('mailto:contacto@cepandora.edu.mx')},
];

export const ContactSection = () => {
  const {isDark} = useTheme();
  const C = colors(isDark);

  const [form, setForm] = useState({nombre: '', email: '', telefono: '', mensaje: ''});

  const enviar = () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa nombre, correo y mensaje.');
      return;
    }
    Alert.alert('¡Mensaje enviado!', 'Nos pondremos en contacto contigo a la brevedad. 🎉');
    setForm({nombre: '', email: '', telefono: '', mensaje: ''});
  };

  return (
    <View style={[styles.section, {backgroundColor: C.bg}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: C.text}]}>Contacto</Text>
        <Text style={[styles.subtitle, {color: C.muted}]}>
          ¿Tienes preguntas? Estamos aquí para ayudarte. Contáctanos y con gusto te atenderemos.
        </Text>
      </View>

      {/* Formulario */}
      <View style={[styles.formCard, {backgroundColor: C.card, borderColor: C.border}]}>
        <TextInput
          value={form.nombre} onChangeText={(v) => setForm(p => ({...p, nombre: v}))}
          placeholder="Nombre completo" placeholderTextColor={C.placeholder}
          style={[styles.input, {backgroundColor: C.inputBg, borderColor: C.border, color: C.text}]}
        />
        <TextInput
          value={form.email} onChangeText={(v) => setForm(p => ({...p, email: v}))}
          placeholder="Correo electrónico" placeholderTextColor={C.placeholder}
          keyboardType="email-address" autoCapitalize="none"
          style={[styles.input, {backgroundColor: C.inputBg, borderColor: C.border, color: C.text}]}
        />
        <TextInput
          value={form.telefono} onChangeText={(v) => setForm(p => ({...p, telefono: v}))}
          placeholder="Teléfono (opcional)" placeholderTextColor={C.placeholder}
          keyboardType="phone-pad"
          style={[styles.input, {backgroundColor: C.inputBg, borderColor: C.border, color: C.text}]}
        />
        <TextInput
          value={form.mensaje} onChangeText={(v) => setForm(p => ({...p, mensaje: v}))}
          placeholder="Escribe tu mensaje..." placeholderTextColor={C.placeholder}
          multiline numberOfLines={4} textAlignVertical="top"
          style={[styles.input, styles.textarea, {backgroundColor: C.inputBg, borderColor: C.border, color: C.text}]}
        />
        <TouchableOpacity style={styles.btn} onPress={enviar} activeOpacity={0.8}>
          <Text style={styles.btnText}>Enviar Mensaje</Text>
        </TouchableOpacity>
      </View>

      {/* Info de contacto */}
      <View style={styles.infoList}>
        {infoItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.infoRow, {backgroundColor: C.card, borderColor: C.border}]}
            onPress={item.action}
            activeOpacity={item.action ? 0.7 : 1}
          >
            <View style={[styles.infoIconBox, {backgroundColor: 'rgba(201,168,76,0.15)'}]}>
              <Text style={styles.infoIcon}>{item.icon}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={[styles.infoLabel, {color: C.text}]}>{item.label}</Text>
              <Text style={[styles.infoValue, {color: C.muted}]}>{item.value}</Text>
            </View>
            {item.action && <Text style={{color: '#c9a84c', fontSize: 18}}>›</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const colors = (isDark: boolean) => ({
  bg:          isDark ? '#111009' : '#f7f5f2',
  card:        isDark ? '#1a1710' : '#ffffff',
  border:      isDark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.25)',
  text:        isDark ? '#f0ebe0' : '#2a1f0e',
  muted:       isDark ? '#a89070' : '#6b5a47',
  inputBg:     isDark ? '#0f0e0b' : '#faf9f7',
  placeholder: isDark ? '#6b5a47' : '#9ca3af',
});

const styles = StyleSheet.create({
  section:     {paddingVertical: 48, paddingHorizontal: 20, gap: 24},
  header:      {alignItems: 'center', gap: 12},
  title:       {fontSize: 26, fontWeight: '800', textAlign: 'center'},
  subtitle:    {fontSize: 14, textAlign: 'center', lineHeight: 22},
  formCard:    {borderRadius: 16, borderWidth: 1, padding: 20, gap: 12},
  input:       {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14,
  },
  textarea:    {height: 100, paddingTop: 12},
  btn:         {
    paddingVertical: 14, borderRadius: 10, alignItems: 'center',
    backgroundColor: '#c9a84c',
    shadowColor: '#c9a84c', shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  btnText:     {color: '#0a0806', fontWeight: '700', fontSize: 15},
  infoList:    {gap: 12},
  infoRow:     {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: 14, borderWidth: 1,
  },
  infoIconBox: {width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center'},
  infoIcon:    {fontSize: 20},
  infoLabel:   {fontSize: 13, fontWeight: '700', marginBottom: 2},
  infoValue:   {fontSize: 13, lineHeight: 18},
});
