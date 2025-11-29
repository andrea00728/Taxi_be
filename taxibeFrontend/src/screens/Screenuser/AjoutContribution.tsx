// AjoutContributionScreen.tsx
import React, { useState } from "react";
import { View, ScrollView, Text, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import tw from "twrnc";
import LigneForm from "@/src/components/contribution/LigneForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import LigneNoActive from "./LigneNoActive";
import ArretBus from "./Arret_byUser";


/**
 * Écran pour ajouter une contribution.
 * Affiche un formulaire pour créer une ligne (LigneForm) et un bouton pour ouvrir le formulaire d'arrêt.
 * Lorsque le formulaire de création de ligne est validé, charge la mise à jour de la liste des lignes.
 * Si la création réussit, ferme le modal et réinitialise l'indicateur de chargement à false.
 * Si une erreur survient, affiche un message d'erreur.
 * Enfin, réinitialise l'indicateur de chargement à false.
 */
export default function AjoutContributionScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [modalVisible,setModalVisible] = useState(false);
  const [modalVisible2,setModalVisible2] = useState(false);

  const handleRefresh = () => {
    
/************* *************/
/**
 * Fonction appelée lorsque l'utilisateur fait un rafraichissement
 * de la liste des lignes.
 * Met à jour l'indicateur de chargement à true, puis
 * incrémente la clé de rechargement et met à jour
 * l'indicateur de chargement à false après 600ms.
 */
/*******  9d3710df-339c-4c93-a8ce-76101f7ca02d  *******/    setRefreshing(true);
    setReloadKey(old => old + 1);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <>
    <ScrollView
      style={tw`flex-1 bg-gray-50`}
      contentContainerStyle={tw`px-5 py-6`}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >

      <View style={tw`bg-white p-5 rounded-xl shadow-md mb-8`}>
        <Text style={tw`text-lg font-semibold mb-3 text-gray-700`}>Créer une Ligne</Text>
        <LigneForm key={`ligne-${reloadKey}`} onCreated={handleRefresh} />
      </View>
    </ScrollView>
               <View style={tw`absolute bottom-6 right-6 gap-4`}>
        
                <TouchableOpacity 
                  onPress={()=>setModalVisible(true)}
                  style={tw`w-14 h-14 bg-green-500 rounded-full items-center justify-center shadow-xl`}
                  activeOpacity={0.7}
                >
                  <Ionicons name="bus" size={24} color="white" />
                </TouchableOpacity>

    {/* pour ouvrire le modal du formulaire d'arret */}
                <TouchableOpacity 
                onPress={()=>setModalVisible2(true)}
                style={tw`w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-xl`}
                activeOpacity={0.7}
                >
                  <Ionicons name="compass-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>

        <LigneNoActive
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
        }} 
      />
      <ArretBus
      visible={modalVisible2}
      onClose={()=>setModalVisible2(false)}
      onSuccess={()=>{
        setModalVisible2(false);
      }}
      />
      </>
  );
}
