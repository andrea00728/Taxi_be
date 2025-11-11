// src/components/contribution/components/FormHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface FormHeaderProps {
  showDebug?: boolean;
  provincesCount?: number;
  regionsCount?: number;
  districtsCount?: number;
}

export const FormHeader = React.memo(({ 
  showDebug = false, 
  provincesCount = 0, 
  regionsCount = 0, 
  districtsCount = 0 
}: FormHeaderProps) => (
  <View style={tw`mb-6`}>
    <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>
      Nouvelle Ligne
    </Text>
    <Text style={tw`text-sm text-gray-500`}>
      Remplissez les informations de la ligne de transport
    </Text>

    {showDebug && __DEV__ && (
      <View style={tw`mt-3 p-3 bg-blue-50 rounded-lg`}>
        <Text style={tw`text-xs text-blue-800`}>
          Debug: {provincesCount} provinces, {regionsCount} régions, {districtsCount} districts
        </Text>
      </View>
    )}
  </View>
));
