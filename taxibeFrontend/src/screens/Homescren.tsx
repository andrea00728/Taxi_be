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

interface Ligne {
  id: number;
  nom: string;
  depart: string;
  terminus: string;
}

interface District {
  id: number;
  nom: string;
  lignes: Ligne[];
}

// Définissez le type des props que Homescren va recevoir
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLignes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/districts`);
      setDistricts(res.data);
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
                    <View key={ligne.id} style={tw`bg-gray-800 rounded-2xl p-5 mb-4`}>
                      <Text style={tw`text-white font-bold text-lg`}>{ligne.nom}</Text>
                      <Text style={tw`text-white`}>{ligne.depart} → {ligne.terminus}</Text>
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
          <ButtonContribution navigation={navigation} />
        </View>
      </View>
    </View>
  );
}









// import React, { useEffect, useState, useCallback } from "react";
// import { 
//   View, 
//   Text, 
//   TextInput,
//   FlatList, 
//   ActivityIndicator, 
//   Pressable,
//   RefreshControl 
// } from "react-native";
// import tw from "twrnc";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import axios from "axios";
// import ButtonContribution from "../components/Buttoncontribution";
// import ButtonDetails from "../components/Buttondetails";
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '@/app/index';
// import { url } from "../utils/url";

// type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// export default function HomeScreen({ navigation }: Props) {
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [search, setSearch] = useState("");

//   // ✅ Fonction pour grouper les lignes par nom
//   const groupLignesByName = useCallback((lignes: Ligne[]): GroupedLigne[] => {
//     const grouped = new Map<string, GroupedLigne>();

//     lignes.forEach(ligne => {
//       const nom = ligne.nom.trim();
//       const existing = grouped.get(nom);

//       if (existing) {
//         existing.trajets.push({
//           id: ligne.id,
//           depart: ligne.depart,
//           terminus: ligne.terminus
//         });
//       } else {
//         grouped.set(nom, {
//           nom: nom,
//           trajets: [{
//             id: ligne.id,
//             depart: ligne.depart,
//             terminus: ligne.terminus
//           }]
//         });
//       }
//     });

//     return Array.from(grouped.values());
//   }, []);

//   // ✅ Fonction de chargement des données
//   const fetchLignes = useCallback(async (isRefreshing = false) => {
//     try {
//       if (!isRefreshing) {
//         setLoading(true);
//       }

//       const res = await axios.get(`${url}/districts`);
      
//       const processedDistricts = res.data
//         .map((district: District) => {
//           const acceptedLignes = district.lignes.filter(
//             (ligne: Ligne) => 
//               ligne.statut?.toLowerCase() === 'accepted' || 
//               ligne.statut?.toLowerCase() === 'actif'
//           );

//           const groupedLignes = groupLignesByName(acceptedLignes);

//           return {
//             ...district,
//             lignes: acceptedLignes,
//             groupedLignes: 
// s
//           };
//         })
//         .filter((d: District) => d.groupedLignes && d.groupedLignes.length > 0);

//       setDistricts(processedDistricts);
//     } catch (err) {
//       console.error("Erreur de chargement :", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [groupLignesByName]);

//   // ✅ Pull to refresh
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchLignes(true);
//   }, [fetchLignes]);

//   useEffect(() => {
//     fetchLignes();
//   }, [fetchLignes]);

//   // ✅ Filtrage des résultats de recherche
//   const filteredDistricts = React.useMemo(() => {
//     if (!search.trim()) {
//       return districts;
//     }

//     const lowercasedSearch = search.toLowerCase();
    
//     return districts
//       .map(district => {
//         const filteredGroups = district.groupedLignes?.filter(groupe =>
//           groupe.nom.toLowerCase().includes(lowercasedSearch) ||
//           groupe.trajets.some(t => 
//             t.depart.toLowerCase().includes(lowercasedSearch) ||
//             t.terminus.toLowerCase().includes(lowercasedSearch)
//           )
//         ) || [];

//         return {
//           ...district,
//           groupedLignes: filteredGroups
//         };
//       })
//       .filter(d => 
//         d.nom.toLowerCase().includes(lowercasedSearch) ||
//         (d.groupedLignes && d.groupedLignes.length > 0)
//       );
//   }, [districts, search]);

//   // ✅ Render de chaque district
//   const renderDistrict = useCallback(({ item: district }: { item: District }) => (
//     <View style={tw`mb-5`}>
//       {/* Nom du district */}
//       <View style={tw`flex-row items-center mb-3 px-5`}>
//         <View style={tw`h-6 w-1 bg-yellow-400 mr-3`} />
//         <Text style={tw`text-xl font-bold text-yellow-400`}>
//           {district.nom}
//         </Text>
//       </View>

//       {/* Lignes groupées */}
//       {district.groupedLignes?.map((groupe) => (
//         <View 
//           key={groupe.nom} 
//           style={tw`bg-gray-800 rounded-2xl p-5 mb-4 mx-5 shadow-lg`}
//         >
//           {/* Nom de la ligne */}
//           <Text style={tw`text-white font-bold text-2xl mb-3`}>
//             {groupe.nom}
//           </Text>

//           {/* Trajets */}
//           {groupe.trajets.map((trajet, index) => (
//             <View 
//               key={trajet.id} 
//               style={tw`flex-row items-center ${index > 0 ? 'mt-3' : ''}`}
//             >
//               <View style={tw`w-8 h-8 bg-yellow-400 rounded-full items-center justify-center`}>
//                 <Text style={tw`text-gray-900 font-bold text-xs`}>
//                   {index + 1}
//                 </Text>
//               </View>
//               <View style={tw`flex-1 ml-3 flex-row items-center`}>
//                 <Ionicons name="location" size={14} color="#FCD34D" />
//                 <Text style={tw`text-gray-300 text-sm ml-1 flex-shrink`}>
//                   {trajet.depart}
//                 </Text>
//                 <Ionicons 
//                   name="arrow-forward" 
//                   size={14} 
//                   color="#FCD34D" 
//                   style={tw`mx-2`}
//                 />
//                 <Text style={tw`text-gray-300 text-sm flex-shrink`}>
//                   {trajet.terminus}
//                 </Text>
//               </View>
//             </View>
//           ))}

//           {/* Badge statut et bouton détails */}
//           <View style={tw`flex-row items-center justify-between mt-4 pt-4 border-t border-gray-700`}>
//             <View style={tw`flex-row items-center`}>
//               <View style={tw`w-2 h-2 bg-green-400 rounded-full mr-2`} />
//               <Text style={tw`text-green-400 text-xs font-semibold`}>
//                 Ligne active
//               </Text>
//             </View>
//             <ButtonDetails navigation={navigation} />
//           </View>
//         </View>
//       ))}
//     </View>
//   ), [navigation]);

//   const keyExtractor = useCallback((item: District) => item.id.toString(), []);

//   // ✅ État vide
//   const ListEmptyComponent = useCallback(() => (
//     <View style={tw`flex-1 items-center justify-center py-20 px-5`}>
//       <View style={tw`w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-6`}>
//         <Ionicons name="bus-outline" size={60} color="#9CA3AF" />
//       </View>
//       <Text style={tw`text-gray-900 text-xl font-bold text-center mb-2`}>
//         {search.trim() 
//           ? `Aucun résultat pour "${search}"`
//           : "Aucune ligne disponible"
//         }
//       </Text>
//       <Text style={tw`text-gray-500 text-center leading-6`}>
//         {search.trim()
//           ? "Essayez avec un autre terme de recherche"
//           : "Les lignes approuvées apparaîtront ici"
//         }
//       </Text>
//     </View>
//   ), [search]);

//   // ✅ Loading initial
//   if (loading && !refreshing) {
//     return (
//       <View style={tw`flex-1 items-center justify-center bg-gray-100`}>
//         <ActivityIndicator size="large" color="#FCB53B" />
//         <Text style={tw`text-gray-700 mt-3 text-base`}>
//           Chargement des lignes...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={tw`flex-1 bg-white`}>
//       {/* ✅ Header avec recherche - EN DEHORS du FlatList */}
//       <View style={tw`bg-white`}>
//         {/* Header principal */}
//         <View style={tw`pt-2 pb-4`}>
//           <View style={tw`flex-row items-center justify-between px-5 mt-4`}>
//             <View style={tw`ml-5`}>
//               <Text style={tw`text-[#000] font-bold text-2xl`}>Bienvenue sur</Text>
//               <Text style={tw`text-yellow-400 font-bold text-5xl`}>Taxi Be</Text>
//             </View>
//             <View style={tw`bg-yellow-400 w-30 h-30 rounded-full items-center justify-center`}>
//               <Ionicons name="car" size={90} color="white" />
//             </View>
//           </View>
//         </View>

//         {/* Barre de recherche */}
//         <View style={tw`bg-[#EEEEEE] px-5 pt-4 pb-2`}>
//           <View style={tw`flex-row items-center bg-white rounded-full px-4 h-14 border border-gray-200 shadow-sm`}>
//             <Ionicons name="search" size={24} color="#6B7280" />
//             <TextInput
//               placeholder="Rechercher une ligne, un arrêt, un lieu..."
//               placeholderTextColor="#9CA3AF"
//               style={tw`flex-1 px-3 text-base text-gray-900`}
//               value={search}
//               onChangeText={setSearch}
//               autoCorrect={false}
//               autoCapitalize="none"
//               returnKeyType="search"
//             />
//             {search.length > 0 && (
//               <Pressable onPress={() => setSearch("")}>
//                 <Ionicons name="close-circle" size={20} color="#6B7280" />
//               </Pressable>
//             )}
//           </View>

//           {/* Compteur de résultats */}
//           {search.trim() && (
//             <Text style={tw`text-gray-600 text-sm mt-3 px-2`}>
//               {filteredDistricts.reduce((acc, d) => acc + (d.groupedLignes?.length || 0), 0)} ligne(s) trouvée(s)
//             </Text>
//           )}
//         </View>
//       </View>

//       {/* ✅ FlatList */}
//       <View style={tw`flex-1 bg-[#EEEEEE]`}>
//         <FlatList
//           data={filteredDistricts}
//           renderItem={renderDistrict}
//           keyExtractor={keyExtractor}
//           ListEmptyComponent={ListEmptyComponent}
//           contentContainerStyle={tw`pt-4 pb-24 ${filteredDistricts.length === 0 ? 'flex-1' : ''}`}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           keyboardDismissMode="on-drag"
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={["#FCB53B"]}
//               tintColor="#FCB53B"
//               title="Actualisation..."
//             />
//           }
//           removeClippedSubviews={false}
//           maxToRenderPerBatch={5}
//           initialNumToRender={3}
//           windowSize={5}
//         />

//         {/* Bouton flottant contribution */}
//         <View style={tw`absolute bottom-6 right-6`}>
//           <ButtonContribution navigation={navigation} />
//         </View>
//       </View>
//     </View>
//   );
// }
