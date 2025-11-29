import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  Pressable, 
  ActivityIndicator 
} from "react-native";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Ligne } from "@/src/type/ligneType";
import { UpdateStatusLigne, deleteLigne } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { StatusBadge } from "../StatusBadge";

export interface LigneCardProps {
  ligne: Ligne;
  onUpdate?: () => void;
  onDelete?: (id: number) => void; 
}

export const LigneCard = React.memo(({ ligne, onUpdate, onDelete }: LigneCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStatut, setCurrentStatut] = useState(ligne.statut); 
  const { userRole } = useAuth();
  const statut = ligne?.statut || 'Attent';
  

/**
 * Supprime une ligne.
 * @throws Erreur si la suppression échoue
 */
  const handleDelete = async () => {
    if (!ligne.id || ligne.id === 0) {
      Alert.alert("Erreur", "ID de ligne invalide");
      return;
    }

    setLoading(true);
    try {
      console.log(" Suppression ligne:", {
        id: ligne.id,
        nom: ligne.nom,
        url: `/lignes/${ligne.id}`
      });

      await deleteLigne(ligne.id);
      
      setShowDeleteModal(false);
      Alert.alert("Succès", "Ligne supprimée avec succès");
      
      //  Appeler le callback de suppression optimiste
      onDelete?.(ligne.id);
      
      // Rafraîchir toute la liste en fallback
      setTimeout(() => onUpdate?.(), 300);
    } catch (error: any) {
      console.error(" Erreur suppression:", {
        id: ligne.id,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          "Impossible de supprimer la ligne";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

 
/**
 * Met à jour le statut d'une ligne.
 * @param newStatus - Nouveau statut de la ligne
 * @returns Une promesse qui résout en la ligne mise à jour
 * @throws Erreur lors de la mise à jour de la ligne
 */
  const handleUpdateStatus = async (newStatus: string) => {
    if (!ligne.id || ligne.id === 0) {
      Alert.alert("Erreur", "ID de ligne invalide");
      return;
    }

    setLoading(true);
    
    //  Mise à jour optimiste du statut (affichage immédiat)
    const previousStatus = currentStatut;
    setCurrentStatut(newStatus);

    try {
      console.log(" Mise à jour statut:", {
        id: ligne.id,
        nom: ligne.nom,
        ancienStatut: previousStatus,
        nouveauStatut: newStatus
      });

      await UpdateStatusLigne(ligne.id, { statut: newStatus });
      
      setShowStatusModal(false);
      Alert.alert("Succès", `Statut changé en ${newStatus}`);
      
      // Rafraîchir la liste en arrière-plan
      onUpdate?.();
    } catch (error: any) {
      console.error("❌ Erreur mise à jour statut:", {
        id: ligne.id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      //  Rollback en cas d'erreur
      setCurrentStatut(previousStatus);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          "Impossible de modifier le statut";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <View style={[tw`bg-white rounded-2xl border-2 border-gray-100 p-5 mb-4`, styles.cardShadow]}>
      {/* Header avec nom et actions admin */}
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <View style={tw`flex-1`}>  
        <Text style={tw`text-gray-800 font-bold text-2xl flex-1`}>{ligne.nom}</Text>
        <Text style={tw`text-gray-500 font-bold text-[3] flex-1`}>{ligne.tarif} Ar</Text>
        </View>
        {/* Boutons d'action pour admin uniquement */}
        {userRole === 'admin' && (
          <View style={tw`flex-row items-center gap-2 ml-2`}>
            <TouchableOpacity
              onPress={() => setShowStatusModal(true)}
              style={tw`bg-white p-2 rounded-lg`}
            >
              <Ionicons name="create-outline" size={25} color="blue" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              style={tw`bg-white p-2 rounded-lg`}
            >
              <Ionicons name="trash-outline" size={25} color="red" />
            </TouchableOpacity>
          </View>
        )}

        <View style={tw` px-3 py-1  ml-2`}>
           <StatusBadge status={statut}/>
        </View>
      </View>

      {/* Trajet */}
      <View style={tw`mt-2`}>
        <View style={tw`flex-row items-center gap-2 mb-2`}>
          <Ionicons name="arrow-forward" size={18} color="#FCD34D" />
          <Text style={tw`text-gray-800 text-base ml-2`}>
            {ligne.depart} 
            <Text style={tw`text-yellow-400 mx-2`}>→</Text>
            {ligne.terminus}
          </Text>
        </View>

        <View style={tw`flex-row items-center gap-2`}>
          <Ionicons name="arrow-back" size={18} color="#FCD34D" />
          <Text style={tw`text-gray-800 text-base ml-2`}>
            {ligne.terminus} 
            <Text style={tw`text-yellow-400 mx-2`}>←</Text>
            {ligne.depart}
          </Text>
        </View>
      </View>

      {/* Arrêts */}
      {ligne.arrets && ligne.arrets.length > 0 && (
        <View style={tw`mt-4 pt-3 border-t border-gray-700`}>
          <Text style={tw`text-yellow-400 font-semibold mb-2`}>
            Arrêts desservis :
          </Text>
          <View style={tw`flex-row flex-wrap`}>
            {ligne.arrets.map(arret => (
              <View 
                key={arret.id} 
                style={tw`bg-gray-700 rounded-full px-3 py-1 mr-2 mb-2`}
              >
                <Text style={tw`text-gray-300 text-sm`}>{arret.nom}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {/* Modal de confirmation de suppression */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable 
          style={tw`flex-1 bg-black/50 justify-center items-center`}
          onPress={() => setShowDeleteModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={tw`bg-white rounded-2xl p-6 mx-5 w-80`}>
              <Ionicons 
                name="warning-outline" 
                size={48} 
                color="#EF4444" 
                style={tw`self-center mb-4`} 
              />
              
              <Text style={tw`text-xl font-bold text-gray-800 text-center mb-2`}>
                Supprimer cette ligne ?
              </Text>
              <Text style={tw`text-gray-600 text-center mb-6`}>
                Cette action est irréversible. La ligne "{ligne.nom}" sera 
                définitivement supprimée.
              </Text>

              <View style={tw`flex-row gap-3`}>
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  style={tw`flex-1 bg-gray-200 py-3 rounded-lg`}
                  disabled={loading}
                >
                  <Text style={tw`text-gray-800 font-bold text-center`}>
                    Annuler
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  style={tw`flex-1 bg-red-500 py-3 rounded-lg`}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={tw`text-white font-bold text-center`}>
                      Supprimer
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal de modification du statut */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <Pressable 
          style={tw`flex-1 bg-black/50 justify-center items-center`}
          onPress={() => setShowStatusModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={tw`bg-white rounded-2xl p-6 mx-5 w-80`}>
              <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
                Modifier le statut
              </Text>

              <TouchableOpacity
                onPress={() => handleUpdateStatus('Accepted')}
                style={tw`bg-green-500 py-3 rounded-lg mb-3`}
                disabled={loading}
              >
                {loading && currentStatut === 'Accepted' ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={tw`text-white font-bold text-center`}>
                     Accepter
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleUpdateStatus('Attent')}
                style={tw`bg-yellow-500 py-3 rounded-lg mb-3`}
                disabled={loading}
              >
                <Text style={tw`text-white font-bold text-center`}>
                   Suspendu
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => setShowStatusModal(false)}
                style={tw`bg-gray-200 py-3 rounded-lg`}
              >
                <Text style={tw`text-gray-800 font-bold text-center`}>
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
});

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
