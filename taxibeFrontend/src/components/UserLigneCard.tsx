// src/screens/Screenuser/components/UserLigneCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Ligne } from '@/src/type/ligneType';
import { StatusBadge } from './StatusBadge';

interface UserLigneCardProps {
  nom: string;
  lignes: Ligne[];
  onPress?: () => void;
}

export const UserLigneCard = React.memo(({ nom, lignes, onPress }: UserLigneCardProps) => {
  // Prendre le premier tarif et statut (assumant qu'ils sont identiques)
  const tarif = lignes[0]?.tarif || '0';
  const statut = lignes[0]?.statut || 'Attent';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[tw`bg-white rounded-2xl p-3  mb-12 `, styles.cardShadow]}
    >
      {/* En-tête avec nom et statut */}
      <View style={tw`flex-row items-start justify-between mb-4`}>
        <View style={tw`flex-1 mr-3`}>
          <Text style={tw`text-xl font-bold text-gray-900 mb-1`}>
            {nom}
          </Text>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="cash-outline" size={16} color="#F59E0B" />
            <Text style={tw`text-yellow-600 font-bold text-base ml-1`}>
              {tarif} Ar
            </Text>
          </View>
        </View>
        <StatusBadge status={statut} />
      </View>

      {/* Trajets */}
    <View style={tw`bg-gray-50 rounded-xl p-4`}>
  {lignes.map((ligne, index) => (
    <View
      key={ligne.id}
      style={tw`${index > 0 ? 'mt-4' : ''}`}
    >
      {/* Numéro de la ligne */}
      <View style={tw`flex-row items-center mb-2`}>
        <View style={tw`w-8 h-8 bg-yellow-400 rounded-full items-center justify-center`}>
          <Text style={tw`text-gray-900 font-bold text-xs`}>
            <Ionicons name="bus-outline" size={16} color="white" />
          </Text>
        </View>
      </View>

      {/* Première ligne : Départ → Terminus */}
      <View style={tw`flex-row items-center ml-11 mb-2`}>
        <Text style={tw`text-gray-900 font-semibold flex-1`} >
          {ligne.depart}
        </Text>
        <Ionicons 
          name="arrow-forward" 
          size={16} 
          color="#6B7280" 
          style={tw`mx-2`}
        />
        <Text style={tw`text-gray-900 font-semibold flex-1`} >
          {ligne.terminus}
        </Text>
      </View>

      {/* Deuxième ligne : Terminus → Départ */}
      <View style={tw`flex-row items-center ml-11`}>
        <Text style={tw`text-gray-900 font-semibold flex-1`} >
          {ligne.terminus}
        </Text>
        <Ionicons 
          name="arrow-back" 
          size={16} 
          color="#6B7280" 
          style={tw`mx-2`}
        />
        <Text style={tw`text-gray-900 font-semibold flex-1`} >
          {ligne.depart}
        </Text>
      </View>
    </View>
  ))}
</View>


      {/* Informations supplémentaires */}
      <View style={tw`flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100`}>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={tw`text-gray-500 text-xs ml-1`}>
            {lignes.length} trajet{lignes.length > 1 ? 's' : ''}
          </Text>
        </View>
        
        {lignes[0]?.arrets && lignes[0].arrets.length > 0 && (
          <View style={tw`flex-row items-center`}>
            <Ionicons name="stop-circle-outline" size={16} color="#6B7280" />
            <Text style={tw`text-gray-500 text-xs ml-1`}>
              {lignes[0].arrets.length} arrêt{lignes[0].arrets.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
