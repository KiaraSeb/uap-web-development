# 📱 Proyecto Expo React Native 

Este proyecto es una aplicación móvil desarrollada con **Expo** y **React Native**.  
La aplicación incluye funcionalidades como manejo de cámara, galería y compatibilidad tanto en **iOS**, **Android** y **Web**.  


## 🚀 Tecnologías utilizadas

- [Expo](https://expo.dev/)  
- [React Native](https://reactnative.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)  
- [Expo MediaLibrary](https://docs.expo.dev/versions/latest/sdk/media-library/)  


## 📂 Estructura del proyecto


├── app/ 
│ ├── index.tsx # Pantalla principal
│ ├── camara.tsx # Pantalla de la cámara
│ └── galeria.tsx # Pantalla de galería
├── assets/ # Iconos e imágenes
├── App.tsx # Punto de entrada
├── tsconfig.json # Configuración TypeScript
└── package.json # Dependencias


## ⚙️ Instalación y ejecución

1. Clona el repositorio:
git clone https://github.com/KiaraSeb/React-Native.git
cd tu-proyecto-expo

Instala las dependencias: npm install o yarn install

Inicia el proyecto en modo desarrollo: npx expo start

## 📱 Ejecución en diferentes plataformas

Web: Presiona w en la terminal cuando Expo esté corriendo.
Android: Escanea el QR con Expo Go desde tu dispositivo Android.
iOS: Escanea el QR con la app Expo Go en tu iPhone.

⚠️ Para compilar una app nativa en iOS necesitas una Mac o usar EAS Build (servicio de Expo en la nube).

## 🔑 Permisos necesarios
La app solicita los siguientes permisos:
- Cámara: para capturar fotos.
- Galería (MediaLibrary): para guardar y acceder a las imágenes. 
- Micrófono (opcional): si se usa la grabación de video.

## 🛠️ Scripts útiles

npm start → Inicia el servidor de Expo.
npm run web → Ejecuta la app en navegador.
npm run ios → Ejecuta la app en iOS (solo en Mac).
npm run android → Ejecuta la app en Android.

---
## Alumna: Kiara Sebestyen 