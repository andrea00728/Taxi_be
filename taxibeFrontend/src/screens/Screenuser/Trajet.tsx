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
import { Arret, Ligne, Route, TrajectModalProps, TrajetResult } from "@/src/type/trajetType";

const TrajetSearchScreen: React.FC<TrajectModalProps> = ({ visible, onClose, onSuccess }) => {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrajetResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [maxTransfers, setMaxTransfers] = useState(2);
  const [maxWalkingDistance, setMaxWalkingDistance] = useState(500);
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
      const response = await axios.get<TrajetResult>(`${url}/Trajet/search`, {
        params: {
          depart: depart.trim(),
          destination: destination.trim(),
          maxTransfers,
          maxWalkingDistance,
          limit: 5,
        },
      });
      setResult(response.data);
      onSuccess?.();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Erreur lors de la recherche. Veuillez réessayer.";
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

          {/* Formulaire de recherche */}
          <View style={tw`mb-4`}>
            <View style={tw`flex-row items-center mb-3`}>
              <TextInput
                placeholder="Point de départ"
                value={depart}
                onChangeText={setDepart}
                style={tw`flex-1 border border-gray-300 rounded-lg p-3 text-base`}
                placeholderTextColor="#999"
              />
            </View>
            <View style={tw`flex-row items-center`}>
              <TextInput
                placeholder="Destination"
                value={destination}
                onChangeText={setDestination}
                style={tw`flex-1 border border-gray-300 rounded-lg p-3 text-base`}
                placeholderTextColor="#999"
              />
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={handleSearch} 
            style={tw`bg-yellow-400 rounded-lg p-4 items-center justify-center ${loading ? 'opacity-50' : ''}`}
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
          
          {/* Section des résultats */}
          {result && <ResultsSection result={result} />}
          
        </View>
      </View>
    </Modal>
  );
};

// --- RÉSULTATS AVEC STATISTIQUES ---
const ResultsSection = ({ result }: { result: TrajetResult }) => {
  const routesWithCost = useMemo(() => {
    return result.routes.map(route => ({
      ...route,
      totalTarif: route.lignes.reduce((sum, ligne) => sum + parseInt(ligne.tarif), 0)
    }));
  }, [result.routes]);

  if (routesWithCost.length === 0) {
    return (
      <View style={tw`items-center py-10`}>
        <Ionicons name="sad-outline" size={48} color="#999" />
        <Text style={tw`text-base text-gray-600 mt-4 font-semibold`}>Aucun trajet trouvé</Text>
        <Text style={tw`text-sm text-gray-500 mt-1 text-center`}>
          Essayez d'augmenter le nombre de correspondances ou la distance de marche.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`mt-4`} showsVerticalScrollIndicator={false}>
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>
          {result.totalFound} option(s)
        </Text>
        <Text style={tw`text-xs text-gray-500`}>
          Filtres: {result.filters.maxTransfers} corresp. max, {result.filters.maxWalkingDistance}
        </Text>
      </View>
      {routesWithCost.map((route, index) => (
        <RouteTreeCard key={index} route={route} index={index} />
      ))}
    </ScrollView>
  );
};

// --- CARTE DE ROUTE EN ARBRE ---
const RouteTreeCard = React.memo(({ route, index }: { route: Route & { totalTarif: number }; index: number }) => {
  const [expanded, setExpanded] = useState(index === 0); // Premier trajet ouvert par défaut

  return (
    <View style={tw`bg-white rounded-xl mb-4 border-2 ${route.type === 'direct' ? 'border-green-400' : 'border-blue-400'} overflow-hidden`}>
      
      {/* HEADER CLIQUABLE */}
      <TouchableOpacity 
        onPress={() => setExpanded(!expanded)}
        style={tw`p-4 ${route.type === 'direct' ? 'bg-green-50' : 'bg-blue-50'}`}
      >
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row items-center flex-1`}>
            <View style={tw`px-3 py-1.5 rounded-full ${route.type === 'direct' ? 'bg-green-500' : 'bg-blue-500'} mr-3`}>
              <Text style={tw`text-white text-xs font-bold`}>
                {route.type === 'direct' ? ' Direct' : ` ${route.transferCount} corresp.`}
              </Text>
            </View>
            <View>
              <Text style={tw`text-base font-bold text-gray-800`}>
                {Math.round(route.totalDistance)}m
              </Text>
              {route.walkingDistance && route.walkingDistance > 0 && (
                <Text style={tw`text-xs text-gray-600`}>
                  🚶 {Math.round(route.walkingDistance)}m à pied
                </Text>
              )}
            </View>
          </View>
          
          <View style={tw`flex-row items-center`}>
            <View style={tw`bg-yellow-400 px-3 py-1.5 rounded-full mr-2`}>
              <Text style={tw`text-white text-xs font-bold`}>{route.totalTarif} Ar</Text>
            </View>
            <Ionicons 
              name={expanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#6B7280" 
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* CONTENU EXPANSIBLE - ARBRE D'ITINÉRAIRE */}
      {expanded && (
        <View style={tw`p-4 bg-white`}>
          
          {/* ARBRE DES ÉTAPES */}
          <View style={tw`mb-4`}>
            {route.lignes.map((ligne, ligneIdx) => (
              <View key={ligne.id}>
                {/* POINT DE DÉPART */}
                {ligneIdx === 0 && (
                  <TreeNode 
                    icon="location"
                    iconColor="#10B981"
                    title={route.arrets[0]?.nom || "Départ"}
                    isStart
                  />
                )}

                {/* LIGNE DE BUS */}
                <TreeBranch />
                <TreeNode 
                  icon="bus"
                  iconColor="#F59E0B"
                  title={ligne.nom}
                  subtitle={`${ligne.depart} → ${ligne.terminus}`}
                  badge={`${ligne.tarif} Ar`}
                  isBus
                />

                {/* ARRÊT DE DESCENTE / CORRESPONDANCE */}
                {ligneIdx < route.lignes.length - 1 && (
                  <>
                    <TreeBranch />
                    <TreeNode 
                      icon="swap-vertical"
                      iconColor="#3B82F6"
                      title={route.arrets[ligneIdx + 1]?.nom || "Correspondance"}
                      subtitle={`🚶 Marcher ${Math.round(
                        calculateDistance(
                          route.arrets[ligneIdx + 1],
                          route.arrets[ligneIdx + 2]
                        )
                      )}m`}
                      isTransfer
                    />
                  </>
                )}

                {/* DESTINATION FINALE */}
                {ligneIdx === route.lignes.length - 1 && (
                  <>
                    <TreeBranch />
                    <TreeNode 
                      icon="flag"
                      iconColor="#EF4444"
                      title={route.arrets[route.arrets.length - 1]?.nom || "Arrivée"}
                      isEnd
                    />
                  </>
                )}
              </View>
            ))}
          </View>

          {/* INSTRUCTIONS DÉTAILLÉES */}
          <View style={tw`bg-gray-50 rounded-lg p-3 border border-gray-200`}>
            <Text style={tw`text-sm font-bold text-gray-700 mb-2`}>Instructions</Text>
            {route.instructions.map((instruction, idx) => (
              <Text key={idx} style={tw`text-xs text-gray-600 mb-1`}>
                {instruction}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
});

// --- COMPOSANTS DE L'ARBRE ---
const TreeNode = ({ 
  icon, 
  iconColor, 
  title, 
  subtitle, 
  badge, 
  isStart, 
  isEnd, 
  isBus,
  isTransfer 
}: {
  icon: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  badge?: string;
  isStart?: boolean;
  isEnd?: boolean;
  isBus?: boolean;
  isTransfer?: boolean;
}) => (
  <View style={tw`flex-row items-center py-2`}>
    <View style={tw`w-10 h-10 rounded-full items-center justify-center mr-3 ${
      isStart ? 'bg-green-100' : isEnd ? 'bg-red-100' : isBus ? 'bg-yellow-100' : 'bg-blue-100'
    }`}>
      <Ionicons name={icon as any} size={20} color={iconColor} />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-sm font-semibold text-gray-800`}>{title}</Text>
      {subtitle && <Text style={tw`text-xs text-gray-500 mt-0.5`}>{subtitle}</Text>}
    </View>
    {badge && (
      <View style={tw`bg-yellow-400 px-2 py-1 rounded-full`}>
        <Text style={tw`text-white text-xs font-bold`}>{badge}</Text>
      </View>
    )}
  </View>
);

const TreeBranch = () => (
  <View style={tw`ml-5 w-0.5 h-6 bg-gray-300`} />
);

// --- FONCTION UTILITAIRE ---
const calculateDistance = (arret1: Arret | undefined, arret2: Arret | undefined): number => {
  if (!arret1 || !arret2) return 0;
  
  const lat1 = parseFloat(arret1.latitude);
  const lon1 = parseFloat(arret1.longitude);
  const lat2 = parseFloat(arret2.latitude);
  const lon2 = parseFloat(arret2.longitude);

  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default TrajetSearchScreen;
