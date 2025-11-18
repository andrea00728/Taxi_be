import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, ActivityIndicator, Pressable } from "react-native";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import ButtonContribution from "../components/Buttoncontribution";
import ButtonDetails from "../components/Buttondetails";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/index'; // Assurez-vous que le chemin est correct
import { url } from "../utils/url";
import { Ligne } from "../type/ligneType";

interface District {
  id: number;
  nom: string;
  lignes: Ligne[];
}

// Définissez le type des props que Homescren va recevoir
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

/**
 * Écran d'accueil de l application Taxibe
 * @param {Props} Props du composant
 * @returns {JSX.Element} Le composant de l'écran d'accueil
 * @example
 * const HomeScreen = () => {
 *   return (
 *     <>
 *       // Composants de l'écran d'accueil
 *     </>
 *   );
 * };
 */
export default function HomeScreen({ navigation }: Props) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

/**
 * Récupère les lignes avec statut "Accepted"
 * @returns Promesse qui résout en un tableau de lignes
 */
  const fetchLignes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/districts`);
      const lignesAcceptees =res.data.map((district:District)=>({
        ...district,
        lignes:district.lignes.filter((ligne:Ligne)=>ligne.statut==="Accepted")
      }))
      setDistricts(lignesAcceptees);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLignes();
  }, []);

  const filterDistrict = districts.map(d => ({
    ...d,
    lignes: d.lignes.filter(
      l =>
        l.nom.toLowerCase().includes(search.toLowerCase()) ||
        l.depart.toLowerCase().includes(search.toLowerCase()) ||
        l.terminus.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(d => d.nom.toLowerCase().includes(search.toLowerCase()) || d.lignes.length > 0);

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-gray-100`}>
        <ActivityIndicator size="large" color="#FCB53B" />
        <Text style={tw`text-gray-700 mt-3`}>Chargement des lignes...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`bg-white w-full pt-2`}>
        <View style={tw`flex-row items-center justify-between px-5 mt-4`}>
          <View style={tw`ml-5`}>
            <Text style={tw`text-[#000] font-bold text-2xl`}>Bienvenue sur</Text>
            <Text style={tw`text-yellow-400 font-bold text-5xl`}>Taxi Be</Text>
          </View>
          <View style={tw`bg-yellow-400 w-30 h-30 rounded-full items-center justify-center`}>
            <Ionicons name="car" size={90} color="white" />
          </View>
        </View>
      </View>

      {/* Conteneur principal qui prend le reste de l'espace */}
      <View style={tw`flex-1 bg-[#EEEEEE] w-full mt-3 mx-auto rounded-2xl`}>
        {/* Barre de recherche */}
         <View style={tw`px-5 mt-4`}>
        <View style={tw`flex-row items-center bg-gray-100 rounded-full px-4 h-14 border border-gray-200`}>
          <Ionicons name="search" size={24} color="#6B7280" />
          <TextInput
            placeholder="Rechercher une ligne, un arrêt, un lieu..."
            placeholderTextColor="#9CA3AF"
            style={tw`flex-1 px-3 text-lg text-gray-900`}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

        {/* Le ScrollView est la seule chose qui défile */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={tw`flex-1`}
          contentContainerStyle={tw`px-5 mt-5 pb-24`} // Padding en bas pour que le bouton ne cache rien
        >
          {filterDistrict.length === 0 ? (
            <Text style={tw`text-gray-700 text-center mt-5`}>
              Aucune ligne disponible
            </Text>
          ) : (
            filterDistrict.map((distr) => (
              <View key={distr.id} style={tw`mb-5`}>
                <Text style={tw`text-lg font-bold text-yellow-400 mb-2`}>
                  {distr.nom}
                </Text>

                {distr.lignes.length === 0 ? (
                  <Text style={tw`text-gray-500`}>Aucun bus pour ce district</Text>
                ) : (
                  distr.lignes.map((ligne) => (
                    <View key={ligne.id} style={tw`bg-white  rounded-2xl border border-gray-500 p-5 mb-4`}>
                      <Text style={tw`text-gray-800 font-bold text-lg`}>{ligne.nom}</Text>
                      <Text style={tw`text-gray-800`}>⇄{ligne.depart} → {ligne.terminus}</Text>
                       <Text style={tw`text-gray-800`}>⇄{ligne.terminus} ←{ligne.depart}</Text>
                      <View style={tw`ml-50 `}>
                        <ButtonDetails navigation={navigation} />
                      </View>
                    </View>
                  ))
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* Bouton flottant */}
        <View style={tw`absolute bottom-6 right-6`}>
          <ButtonContribution  />
        </View>
      </View>
    </View>
  );
}
