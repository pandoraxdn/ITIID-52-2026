// ============================================
// RUTA: src/screens/home/components/HomeHeader.tsx
// Header sticky con logo, links de nav (scroll), toggle de tema y botón Login.
// ============================================

import React, {useState} from 'react';
import {
  View, Text, TouchableOpacity, Image,
  Modal, Pressable, StyleSheet, Animated,
} from 'react-native';
import {useTheme} from '@/context/ThemeContext';
import {useNavigation} from '@react-navigation/native';

const pandoraLogo = require('../../../../assets/pandora.png');

const navLinks = [
  {label: 'Inicio',           id: 'hero'},
  {label: 'Conócenos',        id: 'about'},
  {label: 'Oferta Académica', id: 'offer'},
  {label: 'Admisiones',       id: 'admissions'},
  {label: 'Noticias',         id: 'news'},
  {label: 'Contacto',         id: 'contact'},
];

interface Props {
  onNavigate: (id: string) => void;
}

export const HomeHeader = ({onNavigate}: Props) => {
  const {isDark, toggleTheme} = useTheme();
  const navigation = useNavigation<any>();
  const [menuOpen, setMenuOpen] = useState(false);
  const C = colors(isDark);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <View style={[styles.header, {backgroundColor: C.bg, borderBottomColor: C.border}]}>
        {/* Logo */}
        <TouchableOpacity style={styles.brand} onPress={() => handleNav('hero')} activeOpacity={0.8}>
          <Image source={pandoraLogo} style={styles.logo} />
          <Text style={[styles.brandName, {color: C.text}]} numberOfLines={1}>
            C.E. Pandora
          </Text>
        </TouchableOpacity>

        {/* Acciones */}
        <View style={styles.actions}>
          {/* Toggle tema */}
          <TouchableOpacity onPress={toggleTheme} style={[styles.iconBtn, {backgroundColor: C.iconBg}]} activeOpacity={0.7}>
            <Text style={styles.iconBtnText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          {/* Login */}
          <TouchableOpacity
            style={[styles.loginBtn, {borderColor: '#c9a84c'}]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginText}>Ingresar</Text>
          </TouchableOpacity>

          {/* Menú hamburguesa */}
          <TouchableOpacity onPress={() => setMenuOpen(true)} style={[styles.iconBtn, {backgroundColor: C.iconBg}]} activeOpacity={0.7}>
            <Text style={styles.iconBtnText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Drawer de navegación */}
      <Modal visible={menuOpen} transparent animationType="slide" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)} />
        <View style={[styles.menuSheet, {backgroundColor: C.bg, borderTopColor: C.border}]}>
          <View style={styles.menuHandle} />
          {navLinks.map((l) => (
            <TouchableOpacity key={l.id} onPress={() => handleNav(l.id)}
              style={[styles.menuItem, {borderBottomColor: C.border}]} activeOpacity={0.7}>
              <Text style={[styles.menuItemText, {color: C.text}]}>{l.label}</Text>
              <Text style={{color: '#c9a84c', fontSize: 18}}>›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.menuLoginBtn}
            onPress={() => { setMenuOpen(false); navigation.navigate('Login'); }}
            activeOpacity={0.8}
          >
            <Text style={styles.menuLoginText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const colors = (isDark: boolean) => ({
  bg:     isDark ? 'rgba(10,8,6,0.97)' : 'rgba(250,249,247,0.97)',
  border: isDark ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.3)',
  text:   isDark ? '#f0ebe0' : '#2a1f0e',
  iconBg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
});

const styles = StyleSheet.create({
  header:       {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  brand:        {flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1},
  logo:         {width: 36, height: 36, borderRadius: 18},
  brandName:    {fontSize: 15, fontWeight: '700', flexShrink: 1},
  actions:      {flexDirection: 'row', alignItems: 'center', gap: 8},
  iconBtn:      {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  iconBtnText:  {fontSize: 16},
  loginBtn:     {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#c9a84c',
    backgroundColor: 'rgba(201,168,76,0.1)',
  },
  loginText:    {color: '#c9a84c', fontSize: 12, fontWeight: '700'},
  menuOverlay:  {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'},
  menuSheet:    {
    paddingBottom: 32, paddingTop: 12, borderTopWidth: 1,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  menuHandle:   {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#c9a84c', alignSelf: 'center', marginBottom: 16,
  },
  menuItem:     {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1,
  },
  menuItemText: {fontSize: 16, fontWeight: '500'},
  menuLoginBtn: {
    marginHorizontal: 24, marginTop: 20, paddingVertical: 14,
    borderRadius: 12, alignItems: 'center', backgroundColor: '#c9a84c',
  },
  menuLoginText: {color: '#0a0806', fontWeight: '700', fontSize: 15},
});
