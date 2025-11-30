import React, { useState, useMemo, useCallback } from "react";
import { 
  View, 
  Text,
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  RefreshControl,
  Keyboard
} from "react-native";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import TrajetSearchScreen from "./Trajet";
import { District } from "@/src/type/ligneType";
import { DistrictSection } from "@/src/components/DistrictSection";
import { SearchHeader } from "@/src/components/SearchHeader";
import { EmptyState } from "@/src/components/EmptyState";
import { useLignes } from "@/src/hooks/useLignes";
import { useLogout } from "@/src/utils/logout";

/**
 * Écran d affichage des lignes de Taxibe
 * @description
 * Ce composant affiche la liste des lignes de Taxibe
 * avec des filtres de recherche et de tri.
 * Les données sont mises à jour toutes les 5 minutes
 * et peuvent être rafraîchies manuellement.
 * @example
 * import LigneScreen from "@/src/screens/Screenuser/LigneScreen";
 * <LigneScreen />
 */
/**
 * @param {Props} Props du composant
 * @returns {JSX.Element} Le composant de l'écran des lignes
 */
export default function LigneScreen() {
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const {handleLogout}=useLogout();
  // const { logout } = useAuth();
  const router = useRouter();
  
  const {
    districts,
    loading,
    refreshing,
    error,
    lastUpdate,
    onRefresh,
    fetchLignes
  } = useLignes();

  //  Fonction de recherche mémorisée avec useCallback
  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
  }, []);

  //  Logique de recherche optimisée
  const searchResults = useMemo(() => {
    if (!search.trim()) {
      return districts;
    }

    const lowercasedSearch = search.toLowerCase();
    return districts
      .map(district => {
        const matchedLignes = (district.lignes ?? []).filter(
          ligne =>
            ligne.nom.toLowerCase().includes(lowercasedSearch) ||
            ligne.depart.toLowerCase().includes(lowercasedSearch) ||
            ligne.terminus.toLowerCase().includes(lowercasedSearch) ||
            (ligne.arrets ?? []).some(arret => 
              arret.nom.toLowerCase().includes(lowercasedSearch)
            )
        );

        if (
          matchedLignes.length > 0 ||
          district.nom.toLowerCase().includes(lowercasedSearch)
        ) {
          return {
            ...district,
            lignes: matchedLignes,
          };
        }
        return null;
      })
      .filter((d): d is District => d !== null);
  }, [districts, search]);

  //  Gestion de la déconnexion
  // const handleLogout = useCallback(async () => {
  //   Alert.alert(
  //     'Déconnexion',
  //     'Êtes-vous sûr de vouloir vous déconnecter ?',
  //     [
  //       { text: 'Annuler', style: 'cancel' },
  //       {
  //         text: 'Déconnecter',
  //         style: 'destructive',
  //       /**
  //        * Fonction appelée lorsque le bouton "Déconnecter" est pressé.
  //        * Elle logout l'utilisateur et redirige vers la page d accueil.
  //        */
  //         onPress: async () => {
  //           await logout();
  //           router.replace('/');
  //         },
  //       },
  //     ]
  //   );
  // }, [logout, router]);

  // Gestion du scroll pour fermer le clavier
  const handleScroll = useCallback(() => {
    if (search.length > 0) {
      Keyboard.dismiss();
    }
  }, [search]);

  //  Render callbacks optimisés
  const renderItem = useCallback(({ item }: { item: District }) => (
    <DistrictSection district={item} />
  ), []);

  const keyExtractor = useCallback((item: District) => item.id.toString(), []);

  const ListEmptyComponent = useCallback(() => (
    <EmptyState search={search} onRefresh={onRefresh} />
  ), [search, onRefresh]);

  //  Loading state
  if (loading && !refreshing) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-gray-50`}>
        <ActivityIndicator size="large" color="#FCB53B" />
        <Text style={tw`text-gray-600 mt-4 text-lg`}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Barre de recherche HORS du FlatList pour éviter les problèmes */}
      <View style={tw`bg-white`}>
        <SearchHeader
          search={search}
          onSearchChange={handleSearchChange}
          lastUpdate={lastUpdate}
          error={error}
          onRetry={() => fetchLignes()}
          showDebugInfo={__DEV__}
        />
      </View>

      {/*  FlatList sans header */}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={tw`pb-32 ${searchResults.length === 0 ? 'flex-1' : ''}`}
        showsVerticalScrollIndicator={false}
        //  Propriétés essentielles pour TextInput
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={handleScroll}
        //  RefreshControl
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FCB53B"]}
            tintColor="#FCB53B"
            title="Actualisation..."
            titleColor="#6B7280"
          />
        }
        // Optimisations de performance
        removeClippedSubviews={false} // Désactivé pour TextInput
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={5}
        windowSize={10}
        maintainVisibleContentPosition={
          search.length > 0
            ? {
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
              }
            : undefined
        }
      />

      {/* Bouton Trajet */}
      <View style={tw`absolute top-36 right-6`}>
        <TouchableOpacity 
          onPress={() => {
            Keyboard.dismiss();
            setModalVisible(true);
          }}
          style={[tw`bg-blue-600 rounded-full items-center justify-center shadow-xl`, styles.trajetButton]}
          activeOpacity={0.7}
        >
          <Ionicons name="navigate" size={24} color="white" style={tw`mb-1`} />
          <Text style={tw`text-white font-bold text-sm`}>Trajet</Text>
        </TouchableOpacity>
      </View>

      {/* Boutons flottants */}
      <View style={tw`absolute bottom-6 right-6 gap-4`}>
        {/* Bouton Refresh */}
        <TouchableOpacity 
          onPress={() => {
            Keyboard.dismiss();
            onRefresh();
          }}
          style={tw`w-14 h-14 bg-yellow-500 rounded-full items-center justify-center shadow-xl`}
          activeOpacity={0.7}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Ionicons name="refresh" size={24} color="white" />
          )}
        </TouchableOpacity>

        {/* Bouton Logout */}
        <TouchableOpacity 
          onPress={() => {
            Keyboard.dismiss();
            handleLogout();
          }}
          style={tw`w-14 h-14 bg-red-600 rounded-full items-center justify-center shadow-xl`}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal Trajet */}
      <TrajetSearchScreen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          fetchLignes(true);
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  trajetButton: {
    width: 80,
    height: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
});
