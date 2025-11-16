import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { District } from "@/src/type/ligneType";
import { LigneCard } from "./LigneCard_Admin";

interface DistrictSectionProps {
  district: District;
  onRefresh?: () => void; // Ajout du callback
}

export const DistrictSection = React.memo(({ district, onRefresh }: DistrictSectionProps) => {
  if (!district.lignes || district.lignes.length === 0) {
    return null;
  }

  return (
    <View style={tw`mb-6 px-5`}>
      {/* Header du district */}
      <View style={tw`flex-row items-center mb-3`}>
        <View style={tw`h-8 w-1 bg-yellow-400 mr-3`} />
        <Text style={tw`text-2xl font-bold text-yellow-400`}>
          {district.nom}
        </Text>
        <Text style={tw`text-gray-400 ml-2`}>
          ({district.lignes.length} {district.lignes.length > 1 ? 'lignes' : 'ligne'})
        </Text>
      </View>

      {district.lignes.map((ligne) => (
        <LigneCard 
          key={ligne.id} 
          ligne={ligne}
          onUpdate={onRefresh}
        />
      ))}
    </View>
  );
});
