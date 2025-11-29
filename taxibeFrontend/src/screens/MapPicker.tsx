import React, { useRef, useState, useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity, Alert, Text } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from 'expo-location';
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

/**
 * Component de carte pour sélectionner une position
 * 
 * @param {function} onLocationSelect - Fonction appelée lorsque l'utilisateur sélectionne une position
 * @param {number} initialLat - Latitude initiale de la carte
 * @param {number} initialLng - Longitude initiale de la carte
 * 
 * @returns {JSX.Element} - Composant JSX de la carte
 */
const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  initialLat = 48.8566,
  initialLng = 2.3522
}) => {
  const webViewRef = useRef<WebView>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

/**
 * Récupère la position actuelle de l'utilisateur.
 * Demande la permission de localisation, puis récupère la position actuelle.
 * Si la permission est refusée, affiche un message d'erreur.
 * Si une erreur survient, affiche un message d'erreur.
 * Enfin, centrer la carte sur la position de l'utilisateur et affiche un marqueur.
 * @returns {Promise<void>} - Promesse qui résout lorsque la position actuelle est récupérée.
***/  


  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Demander la permission de localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'La permission de localisation est nécessaire pour centrer la carte sur votre position.'
        );
        setLoading(false);
        return;
      }

      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userPosition = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(userPosition);
      
      // Centrer la carte sur la position de l'utilisateur
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          map.setView([${userPosition.latitude}, ${userPosition.longitude}], 15);
          L.marker([${userPosition.latitude}, ${userPosition.longitude}])
            .addTo(map)
            .bindPopup('Votre position')
            .openPopup();
          true;
        `);
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      Alert.alert('Erreur', 'Impossible de récupérer votre position actuelle');
    } finally {
      setLoading(false);
    }
  };

 
/**
 * Recentre la carte sur la position de l'utilisateur.
 * Si la position de l'utilisateur est disponible et que le référent
 * du composant WebView est défini, injecte du code JavaScript
 * pour centrer la carte sur la position de l'utilisateur.
 * Sinon, appelle la fonction pour récupérer la position actuelle.
 * 
 * @returns {void}
 */
  const recenterMap = () => {
    if (currentLocation && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        map.setView([${currentLocation.latitude}, ${currentLocation.longitude}], 15);
        true;
      `);
    } else {
      getCurrentLocation();
    }
  };

  const mapLat = currentLocation?.latitude ?? initialLat;
  const mapLng = currentLocation?.longitude ?? initialLng;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${mapLat}, ${mapLng}], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        
        var marker = null;
        var currentLocationMarker = null;
        
        // Ajouter un marqueur pour la position actuelle
        ${currentLocation ? `
        currentLocationMarker = L.marker([${mapLat}, ${mapLng}], {
          icon: L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iIzM0NzBGRiIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI2IiBmaWxsPSIjMzQ3MEZGIi8+PC9zdmc+',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        }).addTo(map).bindPopup('Votre position');
        ` : ''}
        
        map.on('click', function(e) {
          var lat = e.latlng.lat;
          var lng = e.latlng.lng;
          
          if (marker) {
            map.removeLayer(marker);
          }
          
          marker = L.marker([lat, lng]).addTo(map);
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            latitude: lat,
            longitude: lng
          }));
        });
      </script>
    </body>
    </html>
  `;

/**
 * Gère un événement de type 'message' pour le composant WebView.
 * Lorsque cet événement est déclenché, essaie de parser le contenu
 * de l'événement en un objet JSON contenant les coordonnées
 * géographiques d'un point.
 * Si le parsing réussit, appelle la fonction onLocationSelect avec
 * les coordonnées géographiques.
 * Si une erreur est levée, affiche un message d'erreur.
 */
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      onLocationSelect(data.latitude, data.longitude);
    } catch (error) {
      console.error("Erreur parsing message:", error);
    }
  };

  return (
    <View style={tw`flex-1 relative`}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
         nestedScrollEnabled={true}
         scrollEnabled={true}
        renderLoading={() => (
          <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
            <ActivityIndicator size="large" color="#FCD34D" />
            <Text style={tw`mt-2 text-gray-600`}>Chargement de la carte...</Text>
          </View>
        )}
      />
      
      {/* Bouton pour recentrer sur la position actuelle */}
      <TouchableOpacity
        style={tw`absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg`}
        onPress={recenterMap}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#3470FF" />
        ) : (
          <Ionicons name="locate" size={24} color="#3470FF" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MapPicker;
