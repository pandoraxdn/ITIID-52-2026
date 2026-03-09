# Arquitectura NativeWind + Expo + TypeScript + React Native Reusables

## 1.- Creación del Proyecto Base

```bash
npx create-expo-app@latest --template blank-typescript app
cd app
```

### ¿Qué hace realmente este comando?

* Crea un proyecto Expo gestionado (managed workflow).
* Configura React Native con Metro como bundler.
* Agrega TypeScript con configuración base (`expo/tsconfig.base`).
* Define `index.ts` como punto de entrada que registra el componente raíz.
* Incluye configuración mínima de Babel.

---

## 1.1.- Corrección de warnings

**Agrega esto a tu `package.json`:**

```json
{
  "overrides": {
    "react": "19.2.0",
    "react-dom": "19.2.0"
  }
}
```

Esto le dice a npm: *"sin importar lo que cada paquete pida, usa siempre esta versión"*. Elimina todas las copias anidadas conflictivas.

Luego limpia y reinstala:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 2.- Instalar dependencias correctas

```bash
npm install nativewind
npm install --save-dev tailwindcss
npm install --save-dev babel-preset-expo
npx expo install expo-font
npx expo install @expo-google-fonts/montserrat
npm install axios
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/drawer
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
```

### ¿Qué es NativeWind realmente?

NativeWind es un **adaptador que transpila clases tipo Tailwind a estilos React Native**.

Internamente:

className="bg-black flex-1"
↓
Se transforma en:
{
  backgroundColor: "#000",
  flex: 1
}

Pero esto no ocurre en runtime puro — ocurre mediante:

* Babel transform
* Metro plugin
* Preset de Tailwind adaptado

### Rol de cada dependencia

#### nativewind

* Permite usar `className` en React Native.
* Expone preset para Tailwind.
* Incluye integración con Metro.

#### tailwindcss

* Genera utilidades basadas en `tailwind.config.js`.
* No genera CSS tradicional en React Native, sino que NativeWind lo interpreta.

#### babel-preset-expo

* Asegura compatibilidad del transformador JSX.
* Permite extender el preset con `jsxImportSource`.

#### expo-font + Google Fonts

* Permite cargar fuentes antes del render.
* Necesario para que Tailwind pueda usar `fontFamily`.

---

## 3.-  Inicializar Tailwind

```bash
npx tailwindcss init
```

Esto crea:

module.exports = { ... }

Aquí defines:

* Qué archivos deben escanearse para extraer clases
* Extensiones de theme
* Presets
* Plugins

---

## 4. Configuración de `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,ts}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "montserrat": ["Montserrat_400Regular"],
        "montserrat-bold": ["Montserrat_700Bold"],
      },
    },
  },
  plugins: [],
};
```

Esto es CRÍTICO.

El preset:

* Reemplaza configuración web por configuración RN.
* Cambia cómo se generan utilidades.
* Adapta propiedades no soportadas por RN.

---

## theme.extend.fontFamily

Esto permite mapear:

font-montserrat
font-montserrat-bold

a fuentes registradas por Expo

---

## 5.- Crear CSS global

 `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Aunque React Native no usa CSS real, NativeWind necesita este archivo como punto de entrada para:

* Leer capas
* Procesar variables
* Construir árbol de utilidades

---

## 6.- Configurar Metro (CLAVE)

`metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",
  inlineRem: 16,
});
```
Metro es el bundler de React Native.

Por defecto:

* No entiende Tailwind
* No procesa CSS

`withNativeWind()`:

1. Intercepta el pipeline de Metro
2. Inyecta procesamiento de `global.css`
3. Traduce clases a objetos JS

Si este paso falla:
NativeWind no funciona.

---

## 7.- Configurar Babel

`babel.config.js`

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

## jsxImportSource

Permite que JSX entienda `className`.

Sin esto:
TypeScript compila, pero Babel no transforma correctamente.

---

## 8.- Tipos para TypeScript

`nativewind-env.d.ts`

```ts
/// <reference types="nativewind/types" />
```

Esto hace que TypeScript:

* Reconozca la prop `className`
* No marque error en componentes React Native

---

## 9.- Sistema de Variables CSS (Design Tokens)

`App.tsx`

```tsx
import "./global.css";
import { View, Text } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-xl font-bold">
        NativeWind funcionando 🚀
      </Text>
    </View>
  );
}
```

Esto conecta:

CSS Variable → Tailwind → NativeWind → RN Style

Ventaja:

* Cambias tema sin reescribir clases.
* Permite dark mode basado en clase.

---

## 10.- Ejecutar limpio

```bash
npx expo start -c
```
---

## 11.- Instalar dependencias de react-native-reusables
```bash
npx expo install tailwindcss-animate class-variance-authority clsx tailwind-merge @rn-primitives/portal lucide-react-native

```
---

## 12.- Crear la estructura de carpetas que React Native Reusables CLI espera
```bash
src/
 ├─ components/
 │   └─ ui/
 └─ lib/
```
```bash
mkdir -p src/components/ui
mkdir -p src/lib
```
---

## 13.- Configurar rutas de alias
### Configurar tsconfig.json
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": "src",
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  }
}
```
---

## 14.- Configurar archivo de estilos global.css
### Modifica el archivo: global.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 63%;
    --radius: 0.625rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark:root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 70.9% 59.4%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 300 0% 45%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

```
---

## 15.- Configurar archivo de configuración de nativewind
### Actualizar tailwind.config.js
```js
const {hairlineWidth} = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,ts}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-native-reusables/**/*.{js,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      borderWidth: {
        hairline: hairlineWidth(),
      },

      keyframes: {
        "accordion-down": {
          from: {height: "0"},
          to: {height: "var(--radix-accordion-content-height)"},
        },
        "accordion-up": {
          from: {height: "var(--radix-accordion-content-height)"},
          to: {height: "0"},
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      fontFamily: {
        montserrat: ["Montserrat_400Regular"],
        "montserrat-bold": ["Montserrat_700Bold"],
      },
    },
  },

  future: {
    hoverOnlyWhenSupported: true,
  },

  plugins: [require("tailwindcss-animate")],
};

```
---

## 16.- Crear archivo de tema del aplicativo
### Crear archivo: src/lib/theme.ts
```ts
import {DarkTheme, DefaultTheme, type Theme} from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 3.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 3.9%)',
    primary: 'hsl(0 0% 9%)',
    primaryForeground: 'hsl(0 0% 98%)',
    secondary: 'hsl(0 0% 96.1%)',
    secondaryForeground: 'hsl(0 0% 9%)',
    muted: 'hsl(0 0% 96.1%)',
    mutedForeground: 'hsl(0 0% 45.1%)',
    accent: 'hsl(0 0% 96.1%)',
    accentForeground: 'hsl(0 0% 9%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    border: 'hsl(0 0% 89.8%)',
    input: 'hsl(0 0% 89.8%)',
    ring: 'hsl(0 0% 63%)',
    radius: '0.625rem',
    chart1: 'hsl(12 76% 61%)',
    chart2: 'hsl(173 58% 39%)',
    chart3: 'hsl(197 37% 24%)',
    chart4: 'hsl(43 74% 66%)',
    chart5: 'hsl(27 87% 67%)',
  },
  dark: {
    background: 'hsl(0 0% 3.9%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(0 0% 3.9%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(0 0% 3.9%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(0 0% 98%)',
    primaryForeground: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 14.9%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(0 0% 14.9%)',
    mutedForeground: 'hsl(0 0% 63.9%)',
    accent: 'hsl(0 0% 14.9%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(0 0% 14.9%)',
    input: 'hsl(0 0% 14.9%)',
    ring: 'hsl(300 0% 45%)',
    radius: '0.625rem',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};

```
---

## 17.- Archivo de Alias CN
### react-native-reusables usa el patrón cn() para combinar clases.
### Crea un helper: src/lib/utils.ts
```ts
import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
---

## 18.- Crear archivo de componentes
### Crea un helper: components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "global.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```
---

## 18.- Agregar estructura de directorios host del portal a su diseño raíz
```bash
app/
├── index.tsx
└── _layout.tsx
```
```ts
mkdir app
touch app/_layout.tsx
```
---

## 19.- Agregue el host del portal a su diseño raíz
### Representa el PortalHostfrom @rn-primitives/portalen tu diseño raíz. 
### Colócalo como el último elemento secundario de tus provider.
### Editar archivo: app/_layout.tsx
```tsx
import {type ReactNode} from "react";
import "../global.css";
import {View} from "react-native";
import {PortalHost} from "@rn-primitives/portal";

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <>
      <View style={{flex: 1}}>
        {children}
      </View>
      <PortalHost />
    </>
  );
}

export default RootLayout;
```
---

## 20.- Validar uso de React Native Reusables en el aplicativo
```bash
npx @react-native-reusables/cli@latest init
```
---

## 21.- Descargar componentes de React Native Reusables
```bash
npx @react-native-reusables/cli@latest add
```
---

## 22.- Cambiar archivo principal del aplicativo
### Editar archivo App.tsx
```tsx
import {View, Text} from "react-native";
import {Button} from "@/components/ui/button";
import RootLayout from "./app/_layout";

const App = () => {
  return (
    <RootLayout>
      <View className="items-center justify-center flex-1 bg-black">
        <Text className="text-xl font-bold text-white">
          NativeWind funcionando
        </Text>
        <Button
          variant="secondary"
        >
          Entrar
        </Button>
      </View>
    </RootLayout>
  );
}

export default App;

```
---

