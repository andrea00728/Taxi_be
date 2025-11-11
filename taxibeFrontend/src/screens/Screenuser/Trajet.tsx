import React, { useState, useCallback, useMemo } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal 
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { url } from "@/src/utils/url";
import tw from "twrnc";

interface Ligne {
  id: number;
  nom: string;
  depart: string;
  terminus: string;
  tarif: number;
}

interface Route {
  type: "direct" | "with_transfer";
  lignes: Ligne[];
  arrets: any[]; // Gardé flexible pour le moment
  transferCount: number;
  score: number;
  recommendation?: string;
  totalTarif: number;
}

interface TrajetResult {
  depart: { query: string; arrets: any[] };
  destination: { query: string; arrets: any[] };
  routes: Route[];
  totalFound: number;
  filters: { maxTransfers: number; limit: number };
}

interface TrajectModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TrajetSearchScreen: React.FC<TrajectModalProps> = ({ visible, onClose, onSuccess }) => {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrajetResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // --- NOUVEL ÉTAT POUR LES FILTRES ---
  const [maxTransfers, setMaxTransfers] = useState(2);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    if (!depart.trim() || !destination.trim()) {
      setError("Veuillez saisir le point de départ et la destination.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // --- APPEL API MIS À JOUR ---
      const response = await axios.get<TrajetResult>(`${url}/Trajet/search`, {
        params: {
          depart: depart.trim(),
          destination: destination.trim(),
          maxTransfers, // Utilisation du filtre
          limit: 5,
        },
      });
      setResult(response.data);
      onSuccess?.();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Erreur lors de la recherche. Veuillez réessayer.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  const resetAndClose = () => {
    setDepart("");
    setDestination("");
    setResult(null);
    setError(null);
    setShowFilters(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <View style={tw`flex-1 justify-end bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-5 max-h-[90%]`}>
          
          {/* Header */}
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Recherche de trajet</Text>
            <View style={tw`flex-row items-center gap-2`}>
              <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={tw`p-2`}>
                <Ionicons name="options-outline" size={24} color={showFilters ? "#fdb900" : "#6B7280"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={resetAndClose} style={tw`p-2`}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filtres avancés */}
          {showFilters && <FilterSection maxTransfers={maxTransfers} setMaxTransfers={setMaxTransfers} />}

          {/* Formulaire de recherche */}
          <View style={tw`flex-row items-center mb-4 gap-2`}>
            <TextInput
              placeholder="Départ"
              value={depart}
              onChangeText={setDepart}
              style={tw`flex-1 border border-gray-300 rounded-lg p-3 text-base`}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Destination"
              value={destination}
              onChangeText={setDestination}
              style={tw`flex-1 border border-gray-300 rounded-lg p-3 text-base`}
              placeholderTextColor="#999"
            />
          </View>
          
          <TouchableOpacity 
            onPress={handleSearch} 
            style={tw`bg-yellow-400 rounded-lg p-4 items-center justify-center ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white font-bold text-base`}>Rechercher</Text>
            )}
          </TouchableOpacity>

          {error && <Text style={tw`text-red-500 font-semibold text-center my-3`}>{error}</Text>}
          
          {/* Section des résultats */}
          {result && <ResultsSection result={result} />}
          
        </View>
      </View>
    </Modal>
  );
};

// --- NOUVEAU COMPOSANT : FILTRES ---
const FilterSection = ({ maxTransfers, setMaxTransfers }: { maxTransfers: number; setMaxTransfers: (n: number) => void }) => (
  <View style={tw`bg-gray-100 p-3 rounded-lg mb-4`}>
    <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>Correspondances max</Text>
    <View style={tw`flex-row justify-around`}>
      {[0, 1, 2, 3].map(num => (
        <TouchableOpacity 
          key={num}
          onPress={() => setMaxTransfers(num)}
          style={tw`w-12 h-12 rounded-full items-center justify-center ${maxTransfers === num ? 'bg-yellow-400' : 'bg-gray-200'}`}
        >
          <Text style={tw`font-bold ${maxTransfers === num ? 'text-white' : 'text-gray-700'}`}>{num}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// --- NOUVEAU COMPOSANT : RÉSULTATS ---
const ResultsSection = ({ result }: { result: TrajetResult }) => {
  // Calcul du coût total pour chaque route
  const routesWithCost = useMemo(() => {
    return result.routes.map(route => ({
      ...route,
      totalTarif: route.lignes.reduce((sum, ligne) => sum + ligne.tarif, 0)
    }));
  }, [result.routes]);

  if (routesWithCost.length === 0) {
    return (
      <View style={tw`items-center py-10`}>
        <Ionicons name="sad-outline" size={48} color="#999" />
        <Text style={tw`text-base text-gray-600 mt-4 font-semibold`}>Aucun trajet trouvé</Text>
        <Text style={tw`text-sm text-gray-500 mt-1`}>Essayez d'augmenter le nombre de correspondances.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`mt-4`} showsVerticalScrollIndicator={false}>
      <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
        🚌 {result.totalFound} trajet(s) trouvé(s)
      </Text>
      {routesWithCost.map((route, index) => (
        <RouteCard key={index} route={route} />
      ))}
    </ScrollView>
  );
};

// --- NOUVEAU COMPOSANT : CARTE DE ROUTE ---
const RouteCard = React.memo(({ route }: { route: Route }) => (
  <View style={tw`bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200`}>
    
    {/* Header de la carte : Badge et Coût Total */}
    <View style={tw`flex-row justify-between items-center mb-3`}>
      <View style={tw`px-3 py-1.5 rounded-full ${route.type === 'direct' ? 'bg-green-500' : 'bg-blue-500'}`}>
        <Text style={tw`text-white text-xs font-bold`}>
          {route.type === 'direct' ? 'Direct' : `${route.transferCount} Corresp.`}
        </Text>
      </View>
      <View style={tw`bg-yellow-400 px-3 py-1.5 rounded-full`}>
        <Text style={tw`text-white text-xs font-bold`}>Total: {route.totalTarif} Ar</Text>
      </View>
    </View>

    {/* Détails des lignes à prendre */}
    {route.lignes.map((ligne, idx) => (
      <View key={ligne.id}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`bg-yellow-500 w-8 h-8 rounded-full items-center justify-center mr-3`}>
            <Text style={tw`text-white font-bold`}>{ligne.nom}</Text>
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base text-gray-800 font-semibold`} numberOfLines={1}>
              {ligne.depart} → {ligne.terminus}
            </Text>
            <Text style={tw`text-sm text-gray-600`}>{ligne.tarif} Ar</Text>
          </View>
        </View>
        {/* Icône de correspondance */}
        {idx < route.lignes.length - 1 && (
          <View style={tw`ml-4 my-2`}>
            <Ionicons name="arrow-down" size={20} color="#6B7280" />
            <Text style={tw`text-xs text-gray-500 ml-6`}>Correspondance à {route.arrets[idx + 1].nom}</Text>
          </View>
        )}
      </View>
    ))}

    {/* Recommandation */}
    {route.recommendation && (
      <Text style={tw`text-sm text-gray-600 italic mt-3 pt-3 border-t border-gray-200`}>
        💡 {route.recommendation}
      </Text>
    )}
  </View>
));

export default TrajetSearchScreen;
