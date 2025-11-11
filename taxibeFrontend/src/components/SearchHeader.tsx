
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SearchHeaderProps {
  search: string;
  onSearchChange: (text: string) => void;
  lastUpdate: Date;
  error: string | null;
  onRetry: () => void;
  showDebugInfo?: boolean;
}

// Pas de React.memo pour éviter les problèmes avec TextInput
export const SearchHeader = ({
  search,
  onSearchChange,
  lastUpdate,
  error,
  onRetry,
  showDebugInfo = false
}: SearchHeaderProps) => {
  return (
    <View style={tw`pt-12 bg-white`}>
      {/* Barre de recherche */}
      <View style={tw`px-5 mb-4`}>
        <View style={tw`flex-row items-center bg-gray-100 rounded-full px-4 h-14 border border-gray-200`}>
          <Ionicons name="search" size={24} color="#6B7280" />
          <TextInput
            placeholder="Rechercher une ligne, un arrêt, un lieu..."
            placeholderTextColor="#9CA3AF"
            style={tw`flex-1 px-3 text-lg text-gray-900`}
            value={search}
            onChangeText={onSearchChange}
            // Propriétés importantes
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="never"
            blurOnSubmit={false}
          />
          {search.length > 0 && (
            <TouchableOpacity 
              onPress={() => onSearchChange("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Indicateur de dernière mise à jour */}
      {showDebugInfo && (
        <View style={tw`px-5 mb-2`}>
          <Text style={tw`text-xs text-gray-500 text-center`}>
            Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </Text>
        </View>
      )}

      {/* Message d'erreur */}
      {error && (
        <View style={tw`mx-5 mb-4 p-4 bg-red-50 rounded-lg border border-red-200`}>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={tw`text-red-700 text-sm ml-2 flex-1`}>{error}</Text>
          </View>
          <TouchableOpacity 
            onPress={onRetry} 
            style={tw`mt-3 self-start bg-red-100 px-4 py-2 rounded-lg`}
          >
            <Text style={tw`text-red-600 font-semibold`}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
