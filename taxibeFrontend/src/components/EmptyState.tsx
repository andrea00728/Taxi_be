import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";

interface EmptyStateProps {
  search: string;
  onRefresh: () => void;
}

export const EmptyState = React.memo(({ search, onRefresh }: EmptyStateProps) => (
  <View style={tw`items-center justify-center mt-20 px-5`}>
    <Ionicons name="sad-outline" size={60} color="#9CA3AF" />
    <Text style={tw`text-gray-500 text-lg mt-4 text-center`}>
      {search.trim() 
        ? `Aucun résultat pour "${search}"`
        : "Aucune ligne disponible"
      }
    </Text>
    {!search.trim() && (
      <TouchableOpacity 
        onPress={onRefresh}
        style={tw`mt-4 px-6 py-3 bg-yellow-400 rounded-full`}
      >
        <Text style={tw`text-gray-900 font-semibold`}>Actualiser</Text>
      </TouchableOpacity>
    )}
  </View>
));
