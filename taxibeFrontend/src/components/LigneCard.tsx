import React from "react";
import { View, Text, StyleSheet } from "react-native";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Ligne } from "@/src/type/ligneType";
import ButtonCommentaire from "./ButtonCommentaire";

export interface GroupedLigne {
  nom: string;
  tarif: string;
  trajets: Array<{
    id: number;
    depart: string;
    terminus: string;
    direction: 'aller' | 'retour';
  }>;
  arrets: Ligne['arrets'];
}

export interface LigneCardProps {
  ligneGroup: GroupedLigne;
}

export const LigneCard = React.memo(({ ligneGroup }: LigneCardProps) => (
  <View style={[tw`bg-white rounded-2xl border-2 border-gray-100 p-5 mb-4`, styles.cardShadow]}>
    {/* Nom de la ligne */}
    <View style={tw`flex-row items-center justify-between mb-3`}>
      <Text style={tw`text-gray-800 font-bold text-2xl`}>{ligneGroup.nom}</Text>
      <View style={tw`bg-yellow-400 px-3 py-1 rounded-full`}>
        <Text style={tw`text-gray-900 font-bold`}>{ligneGroup.tarif} Ar</Text>
      </View>
    </View>

    {/* Trajets groupés */}
    <View style={tw`mt-2`}>
      {ligneGroup.trajets.map((trajet, index) => (
        <View key={trajet.id} style={tw`mb-4`}>
          {/* Première ligne : Départ → Terminus */}
          <View style={tw`flex-row items-center gap-2 mb-2`}>
            <Ionicons 
              name={trajet.direction === 'aller' ? "arrow-forward" : "arrow-back"} 
              size={18} 
              color="#FCD34D" 
            />
            <Text style={tw`text-gray-800 text-base ml-2`}>
              {trajet.depart} 
              <Text style={tw`text-yellow-400 mx-2`}>
                {trajet.direction === 'aller' ? '→' : '←'}
              </Text>
              {trajet.terminus}
            </Text>
          </View>

          {/* Deuxième ligne : Terminus → Départ */}
          <View style={tw`flex-row items-center gap-2 mb-2`}>
            <Ionicons 
              name={trajet.direction === 'aller' ? "arrow-back" : "arrow-forward"} 
              size={18} 
              color="#FCD34D" 
            />
            <Text style={tw`text-gray-800 text-base ml-2`}>
              {trajet.terminus} 
              <Text style={tw`text-yellow-400 mx-2`}>
                {trajet.direction === 'aller' ? '←' : '→'}
              </Text>
              {trajet.depart}
            </Text>
          </View>
        </View>
      ))}
    </View>

    {/* Bouton commentaire - EN DEHORS de la boucle */}
    <View style={tw`mt-2`}>
      <ButtonCommentaire 
        ligneId={ligneGroup.trajets[0]?.id} 
        ligneName={ligneGroup.nom} 
      />
    </View>

    {/* Affichage des arrêts */}
    {(ligneGroup.arrets ?? []).length > 0 && (
      <View style={tw`mt-4 pt-3 border-t border-gray-200`}>
        <Text style={tw`text-yellow-600 font-semibold mb-2`}>
          Arrêts desservis :
        </Text>
        <View style={tw`flex-row flex-wrap`}>
          {ligneGroup.arrets!.map(arret => (
            <View key={arret.id} style={tw`bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2`}>
              <Text style={tw`text-gray-700 text-sm`}>{arret.nom}</Text>
            </View>
          ))}
        </View>
      </View>
    )}
  </View>
));

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
});
