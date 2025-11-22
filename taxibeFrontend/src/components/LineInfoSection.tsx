// src/components/contribution/components/LineInfoSection.tsx
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import tw from 'twrnc';

interface LineInfoSectionProps {
  nomLigne: string;
  tarif: string;
  depart: string;
  terminus: string;
  onNomLigneChange: (text: string) => void;
  onTarifChange: (text: string) => void;
  onDepartChange: (text: string) => void;
  onTerminusChange: (text: string) => void;
}

export const LineInfoSection = React.memo(({
  nomLigne,
  tarif,
  depart,
  terminus,
  onNomLigneChange,
  onTarifChange,
  onDepartChange,
  onTerminusChange
}: LineInfoSectionProps) => (
  <View style={tw`mb-6`}>
    <View style={tw`flex-row mb-4`}>
      <View style={tw`flex-1 mr-2`}>
        <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
          Nom Ligne <Text style={tw`text-red-500`}>*</Text>
        </Text>
        <TextInput
          value={nomLigne}
          onChangeText={onNomLigneChange}
          placeholder="Ex: Bus 29"
          style={tw`px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900`}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={tw`flex-1 ml-2`}>
        <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
          Tarif (Ar) <Text style={tw`text-red-500`}>*</Text>
        </Text>
        <TextInput
          value={tarif}
          onChangeText={onTarifChange}
          keyboardType="numeric"
          placeholder="Ex: 600"
          style={tw`px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900`}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>

    <View style={tw`mb-4`}>
      <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
        Point de Départ 
      </Text>
      <TextInput
        value={depart}
        onChangeText={onDepartChange}
        placeholder="Ex: Analakely"
        style={tw`px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900`}
        placeholderTextColor="#9CA3AF"
      />
    </View>

    <View style={tw`mb-4`}>
      <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
        Terminus 
      </Text>
      <TextInput
        value={terminus}
        onChangeText={onTerminusChange}
        placeholder="Ex: Ambohijatovo"
        style={tw`px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900`}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  </View>
));
