import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { url } from "@/src/utils/url";
import tw from "twrnc";
import { TrajetResult } from "@/src/type/trajetType";

interface SearchFormProps {
  onClose: () => void;
  onResult: (result: TrajetResult) => void;
}

/**
 * Formulaire de recherche de trajet
 * @param {SearchFormProps} props - Informations de fermeture pour la recherche
 * @property {() => void} onClose - Fonction appelée lorsque le bouton "Fermer" est pressé
 * @property {(result: TrajetResult) => void} onResult - Fonction appelée lorsque la recherche a abouti
 */
const SearchForm: React.FC<SearchFormProps> = ({ onClose, onResult }) => {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [maxTransfers, setMaxTransfers] = useState(2);
  const [maxWalkingDistance, setMaxWalkingDistance] = useState(500);

  const handleSearch = async () => {
    if (!depart.trim() || !destination.trim()) {
      setError("Veuillez saisir le point de départ et la destination.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<TrajetResult>(`${url}/Trajet/search`, {
        params: {
          depart: depart.trim(),
          destination: destination.trim(),
          maxTransfers,
          maxWalkingDistance,
          limit: 5,
        },
      });
      onResult(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 
        "Erreur lors de la recherche. Veuillez réessayer.";
      const suggestions = err.response?.data?.suggestions;
      setError(
        suggestions?.length > 0
          ? `${errorMsg}\n\nSuggestions: ${suggestions.join(", ")}`
          : errorMsg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>
          Recherche de trajet
        </Text>
        <View style={tw`flex-row items-center gap-2`}>
          <TouchableOpacity 
            onPress={() => setShowFilters(!showFilters)} 
            style={tw`p-2`}
          >
            <Ionicons 
              name="options-outline" 
              size={24} 
              color={showFilters ? "#fdb900" : "#6B7280"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={tw`p-2`}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`mb-4`}>
        <TextInput
          placeholder="Point de départ"
          value={depart}
          onChangeText={setDepart}
          style={tw`mb-3 border border-gray-300 rounded-lg p-3 text-base`}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
          style={tw`border border-gray-300 rounded-lg p-3 text-base`}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity 
        onPress={handleSearch} 
        style={tw`bg-yellow-400 rounded-lg p-4 items-center justify-center ${
          loading ? 'opacity-50' : ''
        }`}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={tw`flex-row items-center`}>
            <Ionicons name="search" size={20} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-bold text-base`}>Rechercher</Text>
          </View>
        )}
      </TouchableOpacity>

      {error && (
        <View style={tw`bg-red-50 border border-red-200 rounded-lg p-3 mt-3`}>
          <Text style={tw`text-red-600 font-semibold text-sm`}>{error}</Text>
        </View>
      )}
    </>
  );
};

export default SearchForm;
