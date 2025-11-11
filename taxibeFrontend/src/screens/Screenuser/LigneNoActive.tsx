import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  Pressable
} from 'react-native';
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { UserLigneCard } from '@/src/components/UserLigneCard';
import { useUserLignes } from '@/src/hooks/useUserLignes';
import { EmptyLignesState } from '@/src/components/EmptyLignesState';

interface LigneNoActiveModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LigneNoActive: React.FC<LigneNoActiveModalProps> = ({ 
  visible, 
  onClose, 
  onSuccess 
}) => {
  const router = useRouter();
  const {
    groupedLignes,
    loading,
    refreshing,
    error,
    onRefresh
  } = useUserLignes();

 

  const handleAddLigne = () => {
    // Fermer le modal et ouvrir le formulaire de création
    onClose();
    // router.push('/ligne/create');
    Alert.alert('Info', 'Naviguer vers formulaire de création');
  };

  // Header du FlatList
  const ListHeaderComponent = () => (
    <View style={tw`px-5 pt-6 pb-10`}>
      {/* En-tête avec bouton fermer */}
      <View style={tw`flex-row items-center justify-between mb-6`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-2xl font-bold text-gray-900`}>
            Mes Lignes
          </Text>
          <Text style={tw`text-gray-500 mt-1`}>
            {groupedLignes.length} ligne{groupedLignes.length > 1 ? 's' : ''} créée{groupedLignes.length > 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity
            onPress={onClose}
            style={tw`w-12 h-12 bg-gray-200 rounded-full items-center justify-center`}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={28} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Message d'erreur */}
      {error && (
        <View style={tw`bg-red-50 rounded-xl p-4 mb-4 border border-red-200`}>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={tw`text-red-700 text-sm ml-2 flex-1`}>{error}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onRefresh()}
            style={tw`mt-3 self-start bg-red-100 px-4 py-2 rounded-lg`}
          >
            <Text style={tw`text-red-600 font-semibold text-sm`}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Render item
  const renderItem = ({ item }: { item: { nom: string; lignes: any[] } }) => (
    <View style={tw`px-5`}>
      <UserLigneCard
        nom={item.nom}
        lignes={item.lignes}
      />
    </View>
  );

  const keyExtractor = (item: { nom: string; lignes: any[] }) => item.nom;

  // Loading state
  const LoadingView = () => (
    <View style={tw`flex-1 items-center justify-center`}>
      <ActivityIndicator size="large" color="#EAB308" />
      <Text style={tw`text-gray-600 mt-4 text-base`}>
        Chargement de vos lignes...
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay avec fond semi-transparent */}
      <Pressable 
        style={styles.overlay} 
        onPress={onClose}
      >
        {/* Container du modal */}
        <Pressable 
          style={[tw`bg-white`, styles.modalContainer]}
          onPress={(e) => e.stopPropagation()} // Empêcher la fermeture en cliquant dans le modal
        >
          {/* Indicateur de glissement */}
          <View style={tw`items-center py-3`}>
            <View style={tw`w-12 h-1 bg-gray-300 rounded-full`} />
          </View>

          {/* Contenu principal */}
          {loading && !refreshing ? (
            <LoadingView />
          ) : (
            <FlatList
              data={groupedLignes}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ListHeaderComponent={ListHeaderComponent}
              ListEmptyComponent={
                !loading ? <EmptyLignesState onAddPress={handleAddLigne} /> : null
              }
              contentContainerStyle={tw`pb-8 ${groupedLignes.length === 0 ? 'flex-1' : ''}`}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#EAB308']}
                  tintColor="#EAB308"
                  title="Actualisation..."
                  titleColor="#6B7280"
                />
              }
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
});

export default LigneNoActive;
