import { createArret, getLigneByUser } from "@/src/services/api";
import { ArretDto, Ligne } from "@/src/type/ligneType";
import React, { useState, useEffect } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

interface Arret_busModalprops {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// interface Ligne {
//   id: number;
//   nom: string;
// }

const ArretBus: React.FC<Arret_busModalprops> = ({
  visible,
  onClose,
  onSuccess
}) => {
  // États du formulaire
  const [nom, setNom] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [selectedLigne, setSelectedLigne] = useState<string>("");
  
  // États de l'interface
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLignes, setLoadingLignes] = useState<boolean>(false);
  
  // États de validation
  const [errors, setErrors] = useState<{
    nom?: string;
    latitude?: string;
    longitude?: string;
    nomligne?: string;
  }>({});

  // Charger les lignes au montage du composant
  useEffect(() => {
    if (visible) {
      fetchLignes();
    }
  }, [visible]);

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


  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!nom.trim()) {
      newErrors.nom = "Le nom de l'arrêt est requis";
    }

    if (!latitude.trim()) {
      newErrors.latitude = "La latitude est requise";
    } else if (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90) {
      newErrors.latitude = "Latitude invalide (-90 à 90)";
    }

    if (!longitude.trim()) {
      newErrors.longitude = "La longitude est requise";
    } else if (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180) {
      newErrors.longitude = "Longitude invalide (-180 à 180)";
    }

    if (!selectedLigne) {
      newErrors.nomligne = "Veuillez sélectionner une ligne";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNom("");
    setLatitude("");
    setLongitude("");
    setSelectedLigne("");
    setErrors({});
  };

  // Soumettre le formulaire
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

  // Fermer le modal
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
            {/* Header */}
            <View style={tw`flex-row items-center justify-between p-5 border-b border-gray-200`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                Créer un arrêt
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <ScrollView style={tw`max-h-96`}>
              <View style={tw`p-5`}>
                {/* Nom de l'arrêt */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
                    Nom de l'arrêt *
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
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.nom}
                    </Text>
                  )}
                </View>

                {/* Latitude */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
                    Latitude *
                  </Text>
                  <TextInput
                    style={tw`border ${errors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900`}
                    placeholder="Ex: 48.8566"
                    value={latitude}
                    onChangeText={(text) => {
                      setLatitude(text);
                      if (errors.latitude) setErrors({ ...errors, latitude: undefined });
                    }}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                  {errors.latitude && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.latitude}
                    </Text>
                  )}
                </View>

                {/* Longitude */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
                    Longitude *
                  </Text>
                  <TextInput
                    style={tw`border ${errors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900`}
                    placeholder="Ex: 2.3522"
                    value={longitude}
                    onChangeText={(text) => {
                      setLongitude(text);
                      if (errors.longitude) setErrors({ ...errors, longitude: undefined });
                    }}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                  {errors.longitude && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.longitude}
                    </Text>
                  )}
                </View>

                {/* Sélection de la ligne */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>
                    Ligne *
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
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.nomligne}
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
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
