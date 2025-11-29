import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';

interface EmptyLignesStateProps {
  onAddPress?: () => void;
}

export const EmptyLignesState = React.memo(({ onAddPress }: EmptyLignesStateProps) => (
  <View style={tw`flex-1 items-center justify-center px-8 py-20`}>
    <View style={tw`w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6`}>
      <Ionicons name="bus-outline" size={48} color="#9CA3AF" />
    </View>
    
    <Text style={tw`text-gray-900 text-xl font-bold text-center mb-2`}>
      Aucune ligne créée
    </Text>
    
    <Text style={tw`text-gray-500 text-center mb-8 leading-6`}>
      Vous n'avez pas encore créé de ligne de transport. Commencez par ajouter votre première ligne !
    </Text>

    {onAddPress && (
      <TouchableOpacity
        onPress={onAddPress}
        style={tw`bg-yellow-500 px-8 py-4 rounded-full flex-row items-center shadow-lg`}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={tw`text-white font-bold text-base ml-2`}>
          Créer une ligne
        </Text>
      </TouchableOpacity>
    )}
  </View>
));
