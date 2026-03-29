# Expo apk & aab

```bash
npm update
```

---

# **1. Instalar EAS CLI**
## EAS CLI es la interfaz de línea de comandos (CLI) oficial de Expo Application Services (EAS).

En tu proyecto:

```bash
npm install eas-cli
```

Verifica:

```bash
npx eas --version
```

---

# **2. Iniciar EAS en tu proyecto**

En la raíz del proyecto:

```bash
npx eas init
```

Esto crea el archivo:

```
eas.json
```

---

# **3. Asegurar que el proyecto NO dependa de Expo Go**

Para generar builds reales debes permitir código nativo controlado por Expo.

Actualiza *app.json* o *app.config.js*:

```json
{
  "expo": {
    "runtimeVersion": "1",
    "updates": {
      "url": "https://u.expo.dev/nickname"
    }
  }
}
```

> No necesitas ejectar (expo eject). Con EAS esto ya no es necesario.

---

# **4. Login en Expo**

```bash
npx eas login
```

---
# **5. Configurar `eas.json` (recomendado)**

Ejemplo:

```json
{
  "build": {
    "production": {
      "android": {
        "image": "latest",
        "buildType": "app-bundle"
      },
      "ios": {
        "image": "latest",
        "buildType": "release"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    }
  }
}
```

---

# **6. Build para Android (.AAB)**
## Android App Bundle

El comando:

```bash
npx eas build -p android --profile production
```

Esto genera un archivo **.aab** listo para subir a Google Play Console.

### Si es primera vez:

* EAS generará automáticamente tu **keystore** (clave de firma).
* O puedes subir el tuyo.

---

# **7. Build para iOS (.IPA)**

El comando:

```bash
npx eas build -p ios --profile production
```

### Para iOS EAS te pedirá:

* Apple ID
* Team ID
* Crear certificados automáticos

Una vez generado, obtendrás:

* .ipa
* Archivo listo para TestFlight / App Store Connect

---

# 🧪 **8. Probar la build en tu dispositivo**

Android:

```bash
npx eas build -p android --profile preview
```

iOS:

```bash
npx eas build -p ios --profile preview
```

Esto genera builds para instalar mediante QR o link.

---

# **Resumen rápido**

| Plataforma     | Comando                                       |
| -------------- | --------------------------------------------- |
| Android AAB    | `npx eas build -p android`                        |
| iOS IPA        | `npx eas build -p ios`                            |
---

