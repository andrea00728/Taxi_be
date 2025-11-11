# Application de Carte de Transport en Commun

Application React Native avec carte interactive affichant les lignes de transport en commun avec itinéraires suivant les vraies routes.

##  Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [APIs utilisées](#apis-utilisées)
- [Structure du code](#structure-du-code)
- [Utilisation](#utilisation)
- [Personnalisation](#personnalisation)

##  Fonctionnalités

-  **Géolocalisation en temps réel** - Affichage de votre position actuelle
-  **Carte interactive** - Carte Leaflet intégrée avec OpenStreetMap
- **Lignes de transport** - Visualisation des lignes de bus acceptées
-  **Routes réelles** - Les trajectoires suivent les vraies routes via OSRM
-  **Marqueurs personnalisés** - Arrêts de bus avec labels permanents
-  **Popups détaillés** - Informations complètes sur chaque arrêt et ligne
-  **Design moderne** - Style inspiré de Google Maps

## 🛠️ Technologies utilisées

### Bibliothèques React Native

| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| `react-native-webview` | ^13.x | Composant WebView pour afficher du contenu web |
| `expo-location` | ^16.x | API de géolocalisation Expo |
| `react` | ^18.x | Framework React |
| `react-native` | ^0.73.x | Framework mobile |

### Bibliothèques JavaScript (CDN)

| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| `Leaflet` | 1.9.4 | Bibliothèque de cartographie interactive |

### APIs externes

| API | Type | Description |
|-----|------|-------------|
| OpenStreetMap | Gratuit | Tuiles de carte |
| OSRM (Open Source Routing Machine) | Gratuit | Calcul d'itinéraires |

##  Prérequis

- Node.js >= 16.x
- npm ou yarn
- Expo CLI (si projet Expo)
- React Native CLI (si projet React Native pur)
- Android Studio ou Xcode (pour émulateurs)

##  Installation

### 1. Installer les dépendances npm

