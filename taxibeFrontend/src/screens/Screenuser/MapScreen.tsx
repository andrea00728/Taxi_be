import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ligne } from '@/src/type/ligneType';
import { getAllLignesAcceptees } from '@/src/services/api';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  // FIX: Utiliser ReturnType<typeof setInterval> au lieu de NodeJS.Timeout
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fonction pour récupérer les données
  const fetchLignes = useCallback(async () => {
    try {
      const fetchedLignes = await getAllLignesAcceptees();
      const lignesAcceptees = fetchedLignes.filter(
        ligne => ligne.statut === "Accepted" && ligne.arrets && ligne.arrets.length > 0
      );
      
      setLignes(prevLignes => {
        const hasChanged = JSON.stringify(prevLignes) !== JSON.stringify(lignesAcceptees);
        
        if (hasChanged) {
          console.log(`🔄 Mise à jour: ${lignesAcceptees.length} ligne(s) acceptée(s)`);
          
          if (webViewRef.current) {
            const lignesData = lignesAcceptees.map(ligne => ({
              nom: ligne.nom,
              depart: ligne.depart,
              terminus: ligne.terminus,
              tarif: ligne.tarif,
              arrets: ligne.arrets.map(arret => ({
                nom: arret.nom,
                lat: parseFloat(arret.latitude),
                lng: parseFloat(arret.longitude)
              })).filter(arret => !isNaN(arret.lat) && !isNaN(arret.lng))
            })).filter(ligne => ligne.arrets.length > 0);

            webViewRef.current.injectJavaScript(`
              if (typeof updateLignes === 'function') {
                updateLignes(${JSON.stringify(lignesData)});
              }
              true;
            `);
          }
        }
        
        return lignesAcceptees;
      });
    } catch (error: any) {
      console.error("Erreur lors de la récupération des lignes:", error.message);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let locationSubscription: Location.LocationSubscription | null = null;

    const initialize = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission de localisation refusée');
        }
        
        const initialLocation = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.Balanced 
        });
        if (isMounted) {
          setLocation(initialLocation.coords);
        }

        await fetchLignes();

        locationSubscription = await Location.watchPositionAsync(
          { 
            accuracy: Location.Accuracy.High, 
            timeInterval: 5000, 
            distanceInterval: 10 
          },
          (newLocation) => {
            if (isMounted) {
              setLocation(newLocation.coords);
              webViewRef.current?.injectJavaScript(`
                if (typeof updateUserLocation === 'function') {
                  updateUserLocation({
                    latitude: ${newLocation.coords.latitude},
                    longitude: ${newLocation.coords.longitude}
                  });
                }
                true;
              `);
            }
          }
        );

        // Démarrer le polling - utilise setInterval directement
        pollingIntervalRef.current = setInterval(() => {
          if (isMounted) {
            console.log('🔍 Vérification des nouvelles données...');
            fetchLignes();
          }
        }, 30000); // 30 secondes

      } catch (error: any) {
        if (isMounted) {
          console.error("Erreur d'initialisation:", error.message);
          setErrorMsg("Impossible de charger les données.");
          setLocation({ latitude: -21.442731, longitude: 47.090542 });
        }
      } finally {
        if(isMounted) setLoading(false);
      }
    };

    initialize();

    return () => {
      isMounted = false;
      locationSubscription?.remove();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchLignes]);

  const generateMapHTML = () => {
    if (!location) return '';

    const lignesData = lignes.map(ligne => ({
      nom: ligne.nom,
      depart: ligne.depart,
      terminus: ligne.terminus,
      tarif: ligne.tarif,
      arrets: ligne.arrets.map(arret => ({
        nom: arret.nom,
        lat: parseFloat(arret.latitude),
        lng: parseFloat(arret.longitude)
      })).filter(arret => !isNaN(arret.lat) && !isNaN(arret.lng))
    })).filter(ligne => ligne.arrets.length > 0);

    console.log(`📍 Génération de la carte avec ${lignesData.length} ligne(s)`);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; }
    
    .ligne-label {
      background-color: #1E88E5;
      color: white;
      border: 2px solid white;
      border-radius: 16px;
      padding: 4px 12px;
      font-weight: bold;
      font-size: 13px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.4);
      white-space: nowrap;
    }
    .ligne-label::before {
      border-top-color: transparent !important;
    }
    
    .leaflet-popup-content-wrapper {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .leaflet-popup-content {
      margin: 16px 20px;
      line-height: 1.5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .popup-header {
      font-weight: 600;
      font-size: 17px;
      margin-bottom: 10px;
      color: #1E88E5;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .popup-icon {
      font-size: 20px;
    }
    .popup-details {
      font-size: 14px;
      color: #424242;
      line-height: 1.8;
    }
    .popup-row {
      display: flex;
      margin-bottom: 6px;
    }
    .popup-label {
      font-weight: 500;
      color: #757575;
      min-width: 70px;
    }
    .popup-value {
      color: #212121;
      font-weight: 400;
    }
    .status-badge {
      display: inline-block;
      background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      margin-top: 8px;
      box-shadow: 0 2px 4px rgba(76,175,80,0.3);
    }
    
    .user-location-marker {
      background: radial-gradient(circle, #4285F4 0%, #1976D2 100%);
      border: 4px solid white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.4);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
      }
      70% {
        box-shadow: 0 0 0 15px rgba(66, 133, 244, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
      }
    }

    .update-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(76, 175, 80, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .update-indicator.show {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="updateIndicator" class="update-indicator">🔄 Mise à jour...</div>
  
  <script>
    let map;
    let userMarker;
    let currentLignes = [];
    const lineMarkers = new Map();
    const linePolylines = new Map();
    
    const userLocation = [${location.latitude}, ${location.longitude}];
    const initialLignesData = ${JSON.stringify(lignesData)};
    
    console.log('🗺️ Initialisation de la carte...');

    map = L.map('map', {
      zoomControl: true,
      attributionControl: true
    }).setView(userLocation, 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const userIcon = L.divIcon({
      className: 'user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    userMarker = L.marker(userLocation, { 
      icon: userIcon,
      zIndexOffset: 1000 
    }).addTo(map);
    
    userMarker.bindPopup(
      '<div class="popup-header">' +
      '<span class="popup-icon">📍</span>' +
      '<span>Votre position</span>' +
      '</div>' +
      '<div class="popup-details">Vous êtes ici</div>'
    );

    const lineColors = [
      '#1E88E5', '#43A047', '#E53935', '#FB8C00', '#8E24AA', '#00ACC1'
    ];

    function showUpdateIndicator() {
      const indicator = document.getElementById('updateIndicator');
      indicator.classList.add('show');
      setTimeout(() => {
        indicator.classList.remove('show');
      }, 2000);
    }

    async function getOSRMRoute(waypoints) {
      try {
        const coords = waypoints.map(wp => \`\${wp[1]},\${wp[0]}\`).join(';');
        const url = \`https://router.project-osrm.org/route/v1/driving/\${coords}?overview=full&geometries=geojson\`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const routeCoords = data.routes[0].geometry.coordinates;
          return routeCoords.map(coord => [coord[1], coord[0]]);
        } else {
          return waypoints;
        }
      } catch (error) {
        console.error('❌ Erreur OSRM:', error);
        return waypoints;
      }
    }

    function clearLignes() {
      lineMarkers.forEach(markers => {
        markers.forEach(marker => map.removeLayer(marker));
      });
      linePolylines.forEach(polylines => {
        polylines.forEach(polyline => map.removeLayer(polyline));
      });
      lineMarkers.clear();
      linePolylines.clear();
    }

    async function processLignes(lignesData, showIndicator = false) {
      if (showIndicator) {
        showUpdateIndicator();
      }
      
      console.log(\`🔄 Traitement de \${lignesData.length} ligne(s)...\`);
      clearLignes();
      
      const allLatLngs = [userMarker.getLatLng()];

      for (let ligneIndex = 0; ligneIndex < lignesData.length; ligneIndex++) {
        const ligne = lignesData[ligneIndex];
        
        if (ligne.arrets.length === 0) continue;

        const lineColor = lineColors[ligneIndex % lineColors.length];
        const waypoints = [];
        const markers = [];

        ligne.arrets.forEach(function(arret) {
          const latLng = [arret.lat, arret.lng];
          waypoints.push(latLng);
          allLatLngs.push(latLng);

          const stopMarker = L.circleMarker(latLng, {
            radius: 8,
            fillColor: lineColor,
            color: '#FFFFFF',
            weight: 3,
            opacity: 1,
            fillOpacity: 1
          }).addTo(map);

          stopMarker.bindTooltip(ligne.nom, {
            permanent: true,
            direction: 'top',
            className: 'ligne-label',
            offset: [0, -12]
          });

          stopMarker.bindPopup(
            '<div class="popup-header">' +
            '<span class="popup-icon">🚍</span>' +
            '<span>' + arret.nom + '</span>' +
            '</div>' +
            '<div class="popup-details">' +
            '<div class="popup-row">' +
            '<span class="popup-label">Ligne:</span>' +
            '<span class="popup-value">' + ligne.nom + '</span>' +
            '</div>' +
            '<div class="popup-row">' +
            '<span class="popup-label">Trajet:</span>' +
            '<span class="popup-value">' + ligne.depart + ' → ' + ligne.terminus + '</span>' +
            '</div>' +
            '<div class="popup-row">' +
            '<span class="popup-label">Tarif:</span>' +
            '<span class="popup-value">' + ligne.tarif + ' Ar</span>' +
            '</div>' +
            '</div>'
          );

          markers.push(stopMarker);
        });

        lineMarkers.set(ligne.nom, markers);

        if (waypoints.length > 1) {
          const routeCoords = await getOSRMRoute(waypoints);
          const polylines = [];
          
          const borderLine = L.polyline(routeCoords, {
            color: '#FFFFFF',
            weight: 8,
            opacity: 0.6,
            smoothFactor: 1,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          const mainLine = L.polyline(routeCoords, {
            color: lineColor,
            weight: 6,
            opacity: 0.8,
            smoothFactor: 1,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          mainLine.bindPopup(
            '<div class="popup-header">' +
            '<span class="popup-icon">🚌</span>' +
            '<span>Ligne ' + ligne.nom + '</span>' +
            '</div>' +
            '<div class="popup-details">' +
            '<div class="popup-row">' +
            '<span class="popup-label">Départ:</span>' +
            '<span class="popup-value">' + ligne.depart + '</span>' +
            '</div>' +
            '<div class="popup-row">' +
            '<span class="popup-label">Arrivée:</span>' +
            '<span class="popup-value">' + ligne.terminus + '</span>' +
            '</div>' +
            '<div class="popup-row">' +
            '<span class="popup-label">Arrêts:</span>' +
            '<span class="popup-value">' + ligne.arrets.length + '</span>' +
            '</div>' +
            '<div class="popup-row">' +
            '<span class="popup-label">Tarif:</span>' +
            '<span class="popup-value">' + ligne.tarif + ' Ar</span>' +
            '</div>' +
            '</div>'
          );

          polylines.push(borderLine, mainLine);
          linePolylines.set(ligne.nom, polylines);
        }
      }

      if (!showIndicator && allLatLngs.length > 1) {
        const bounds = L.latLngBounds(allLatLngs);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      }

      currentLignes = lignesData;
      console.log('✅ Carte mise à jour');
    }

    window.updateUserLocation = function(coords) {
      const latLng = [coords.latitude, coords.longitude];
      if (userMarker) {
        userMarker.setLatLng(latLng);
        console.log('📍 Position utilisateur mise à jour');
      }
    };

    window.updateLignes = function(newLignesData) {
      console.log('🔄 Nouvelles données reçues de React Native');
      processLignes(newLignesData, true);
    };

    processLignes(initialLignesData);
  </script>
</body>
</html>
    `;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Chargement des lignes de transport...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (lignes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.infoText}>Aucune ligne acceptée disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <WebView
          ref={webViewRef}
          source={{ html: generateMapHTML() }}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          onLoadStart={() => console.log('🔄 Chargement de la carte...')}
          onLoadEnd={() => console.log('✅ Carte chargée')}
          onError={(syntheticEvent) => {
            console.error('❌ Erreur WebView:', syntheticEvent.nativeEvent);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#D32F2F',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});
