import React from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

interface SubmitButtonProps {
  loading: boolean;
  onPress: () => void;
}

export const SubmitButton = React.memo(({ loading, onPress }: SubmitButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    style={tw`py-4 rounded-lg shadow-md ${loading ? "bg-yellow-300" : "bg-yellow-500"}`}
    activeOpacity={0.8}
  >
    {loading ? (
      <View style={tw`flex-row justify-center items-center`}>
        <ActivityIndicator color="white" size="small" />
        <Text style={tw`ml-2 text-white font-bold text-base`}>
          Création en cours...
        </Text>
      </View>
    ) : (
      <Text style={tw`text-center text-white font-bold text-base`}>
         Créer la Ligne
      </Text>
    )}
  </TouchableOpacity>
));
