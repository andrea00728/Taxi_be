import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import tw from "twrnc";
import { TrajetResult } from "@/src/type/trajetType";
import RouteTreeCard from "./RouteTreeCard";

interface ResultsSectionProps {
  result: TrajetResult;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result }) => {
  const routesWithCost = useMemo(() => {
    return result.routes.map(route => ({
      ...route,
      totalTarif: route.lignes.reduce((sum, ligne) => 
        sum + parseInt(ligne.tarif), 0
      )
    }));
  }, [result.routes]);

  if (routesWithCost.length === 0) {
    return (
      <View style={tw`items-center py-10`}>
        <Ionicons name="sad-outline" size={48} color="#999" />
        <Text style={tw`text-base text-gray-600 mt-4 font-semibold`}>
          Aucun trajet trouvé
        </Text>
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

export default ResultsSection;
