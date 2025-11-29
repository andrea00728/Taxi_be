import { createArret, getLigneByUser } from "@/src/services/api";
import { ArretDto, Ligne } from "@/src/type/ligneType";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";
import MapPicker from "../MapPicker";


interface Arret_busModalprops {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Component de création d'arrêt.
 * Affiche un modal contenant un formulaire pour créer un arrêt.
 * Le formulaire contient un champ pour le nom de l'arrêt, un champ pour la position
 * de l'arrêt (sélectionnable sur une carte) et un champ pour la ligne associée
 * à l'arrêt.
 * Si le formulaire est valide, charge la création de l'arrêt avec les données du formulaire.
 * Si la création réussit, affiche un message de succès et réinitialise le formulaire.
 * Si une erreur survient, affiche un message d'erreur.
 * Enfin, réinitialise l'indicateur de chargement à false.
 * @param {boolean} visible Indique si le modal doit être affiché.
 * @param {() => void} onClose Fonction appelée lorsque le modal est fermé.
 * @param {() => void} onSuccess Fonction appelée si la création de l'arrêt réussit.
 */
const ArretBus: React.FC<Arret_busModalprops> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [nom, setNom] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [selectedLigne, setSelectedLigne] = useState<string>("");
  
  const [selectedPosition, setSelectedPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLignes, setLoadingLignes] = useState<boolean>(false);
  
  const [errors, setErrors] = useState<{
    nom?: string;
    position?: string;
    nomligne?: string;
  }>({});

  useEffect(() => {
    if (visible) {
      fetchLignes();
    }
  }, [visible]);

/**
 * Récupère les lignes associées à l'utilisateur courant.
 * @returns Une promesse qui résout en un tableau de lignes.
 */
  const fetchLignes = async () => {
    setLoadingLignes(true);
    try {
      const response = await getLigneByUser();
      setLignes(response || []); 
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les lignes");
      console.error("Erreur lors du chargement des lignes:", error);
    } finally {
      setLoadingLignes(false);
    }
  };


  
/**
 * Met à jour la position de l'arrêt avec les coordonnées
 * géographiques données en paramètres.
 * Si une erreur est présente pour la position, la supprime.
 * @param {number} lat Latitude de l'arrêt.
 * @param {number} lng Longitude de l'arrêt.
 * 
 * **/
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedPosition({ latitude: lat, longitude: lng });
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    
    if (errors.position) {
      setErrors({ ...errors, position: undefined });
    }
  };

/**
 * Valide le formulaire de création d'arrêt.
 * Retourne true si le formulaire est valide, false sinon.
 * Met à jour les erreurs en fonction des erreurs de validation.
 * @returns {boolean} True si le formulaire est valide, false sinon.
 */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!nom.trim()) {
      newErrors.nom = "Le nom de l'arrêt est requis";
    }

    if (!selectedPosition) {
      newErrors.position = "Veuillez sélectionner une position sur la carte";
    }

    if (!selectedLigne) {
      newErrors.nomligne = "Veuillez sélectionner une ligne";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

/**
 * Réinitialise le formulaire de création d'arrêt.
 * Supprime le nom, la latitude, la longitude, la ligne sélectionnée et la position.
 * Réinitialise les erreurs.
 */
  const resetForm = () => {
    setNom("");
    setLatitude("");
    setLongitude("");
    setSelectedLigne("");
    setSelectedPosition(null);
    setErrors({});
  };

/**
 * Soumet le formulaire de création d'arrêt
 * Si le formulaire est invalide, on ne fait rien
 * Sinon, on charge la création de l'arrêt avec les données du formulaire
 * Si la création réussit, on affiche un message de succès et on réinitialise le formulaire
 * Si une erreur survient, on affiche un message d'erreur
 * Enfin, on réinitialise l'indicateur de chargement à false
 */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const data: ArretDto = {
        nom: nom.trim(),
        latitude,
        longitude,
        nomligne: selectedLigne
      };

      await createArret(data);
      
      Alert.alert("Succès", "L'arrêt a été créé avec succès");
      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer l'arrêt");
      console.error("Erreur lors de la création de l'arrêt:", error);
    } finally {
      setLoading(false);
    }
  };

/**
 * Ferme le modal et réinitialise le formulaire
 */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center px-4`}>
          <View style={tw`bg-white rounded-2xl w-full max-w-md`}>
            <View style={tw`flex-row items-center justify-between p-5 border-b border-gray-200`}>
              <View
              style={tw`bg-yellow-400 w-10 h-10 rounded-full`}
              />
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`max-h-[500px]`}>
              <View style={tw`p-5`}>
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
                    Nom 
                  </Text>
                  <TextInput
                    style={tw`border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900`}
                    placeholder="Ex: Place de la République"
                    value={nom}
                    onChangeText={(text) => {
                      setNom(text);
                      if (errors.nom) setErrors({ ...errors, nom: undefined });
                    }}
                    editable={!loading}
                  />
                  {errors.nom && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>{errors.nom}</Text>
                  )}
                </View>

                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
                    Position 
                  </Text>
                  <Text style={tw`text-xs text-gray-500 mb-2`}>
                    Cliquez sur la carte pour sélectionner la position
                  </Text>
                  
                  <View style={tw`border ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-lg overflow-hidden h-60`}>
                    <MapPicker
                      onLocationSelect={handleLocationSelect}
                      initialLat={48.8566}
                      initialLng={2.3522}
                    />
                  </View>
                  
                  {selectedPosition && (
                    <View style={tw`mt-2 bg-gray-50 p-2 rounded-lg`}>
                      <Text style={tw`text-xs text-gray-600`}>
                        Latitude: {selectedPosition.latitude.toFixed(6)}
                      </Text>
                      <Text style={tw`text-xs text-gray-600`}>
                        Longitude: {selectedPosition.longitude.toFixed(6)}
                      </Text>
                    </View>
                  )}
                  
                  {errors.position && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>{errors.position}</Text>
                  )}
                </View>

                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
                    Ligne 
                  </Text>
                  {loadingLignes ? (
                    <ActivityIndicator size="small" color="#FCD34D" />
                  ) : (
                    <View style={tw`border ${errors.nomligne ? 'border-red-500' : 'border-gray-300'} rounded-lg`}>
                      {lignes.length === 0 ? (
                        <Text style={tw`text-gray-500 p-4 text-center`}>
                          Aucune ligne disponible
                        </Text>
                      ) : (
                        lignes.map((ligne) => (
                          <TouchableOpacity
                            key={ligne.id}
                            style={tw`flex-row items-center p-4 border-b border-gray-100 ${
                              selectedLigne === ligne.nom ? 'bg-yellow-50' : ''
                            }`}
                            onPress={() => {
                              setSelectedLigne(ligne.nom);
                              if (errors.nomligne) setErrors({ ...errors, nomligne: undefined });
                            }}
                            disabled={loading}
                          >
                            <View style={tw`w-5 h-5 rounded-full border-2 ${
                              selectedLigne === ligne.nom 
                                ? 'border-yellow-400 bg-yellow-400' 
                                : 'border-gray-300'
                            } items-center justify-center mr-3`}>
                              {selectedLigne === ligne.nom && (
                                <Ionicons name="checkmark" size={14} color="white" />
                              )}
                            </View>
                            <Text style={tw`text-gray-900 font-medium flex-1`}>
                              {ligne.nom}
                            </Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </View>
                  )}
                  {errors.nomligne && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>{errors.nomligne}</Text>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={tw`flex-row p-5 border-t border-gray-200 gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 py-3 px-4 border border-gray-300 rounded-lg`}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={tw`text-gray-700 font-semibold text-center`}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-3 px-4 bg-yellow-400 rounded-lg ${
                  loading ? 'opacity-50' : ''
                }`}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#1F2937" />
                ) : (
                  <Text style={tw`text-gray-900 font-semibold text-center`}>
                    Créer
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ArretBus;
