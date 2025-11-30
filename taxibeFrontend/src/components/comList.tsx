import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert, Modal, Pressable,Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { getComsByLigne, removeCommentaire } from "../services/api";
import { commentaire } from "../type/comsType";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from 'jwt-decode';

interface ComsListProps {
  ligneId: number;
  refreshTrigger: number;
  onCommentDeleted: () => void;
}

interface DecodedToken {
  uid: string;
  role: string;
}

export default function CommentaireList({ ligneId, refreshTrigger, onCommentDeleted }: ComsListProps) {
  const [commentaires, setCommentaires] = useState <commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { userToken, userRole } = useAuth();


 const formatTimeAgo = (date: Date | string): string => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "À l'instant";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes} min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours}h`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `il y a ${days}j`;
    } else {
      // Format date complète pour les vieux commentaires
      return commentDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };


  const getCurrentUserUid = (): string | null => {
    if (!userToken) return null;
    try {
      const decoded: DecodedToken = jwtDecode(userToken);
      return decoded.uid;
    } catch (error) {
      console.error("Erreur décodage token:", error);
      return null;
    }
  };

  const fetchCommentaires = async () => {
    try {
      const data = await getComsByLigne(ligneId);
      setCommentaires(data);
    } catch (error) {
      console.error("Erreur chargement commentaires:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCommentaires();
  }, [ligneId, refreshTrigger]);

  const getSatisfactionEmoji = (satisfaction: string) => {
    switch (satisfaction) {
      case 'decevant':
        return { emoji: '😞', color: '#EF4444', bg: 'bg-red-50' };
      case 'excellent':
        return { emoji: '😍', color: '#10B981', bg: 'bg-green-50' };
      default:
        return { emoji: '😐', color: '#F59E0B', bg: 'bg-yellow-50' };
    }
  };

  // Vérifier si l'utilisateur peut supprimer ce commentaire
  const canDelete = (comment: commentaire): boolean => {
    const currentUid = getCurrentUserUid();
    if (!currentUid) return false;
    
    // L'utilisateur est le créateur OU est admin
    return comment.firebase_uid === currentUid || userRole === 'admin';
  };

  const handleDelete = async (commentId: number) => {
    Alert.alert(
      "Supprimer le commentaire",
      "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      [
        {
          text: "Annuler",
          style: "cancel",
          onPress: () => setMenuVisible(null)
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await removeCommentaire(commentId);
              Alert.alert("Succès", "Commentaire supprimé avec succès");
              setMenuVisible(null);
              onCommentDeleted();
            } catch (error: any) {
              console.error("Erreur suppression:", error);
              if (error.response?.status === 403) {
                Alert.alert("Erreur", "Vous n'êtes pas autorisé à supprimer ce commentaire");
              } else {
                Alert.alert("Erreur", "Impossible de supprimer le commentaire");
              }
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={tw`items-center justify-center py-10`}>
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  if (commentaires.length === 0) {
    return (
      <View style={tw`bg-white rounded-lg p-6 items-center mt-2`}>
        <Ionicons name="chatbubbles-outline" size={48} color="#BCC0C4" />
        <Text style={tw`text-gray-500 mt-3 text-center text-sm`}>
          Aucun avis pour le moment
        </Text>
        <Text style={tw`text-gray-400 text-xs text-center mt-1`}>
          Soyez le premier à partager votre expérience !
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`mt-2`}>
      {commentaires.map((comment) => {
        const reaction = getSatisfactionEmoji(comment.satisfaction);
        const showMenu = menuVisible === comment.id;
        
        return (
          <View key={comment.id} style={tw`bg-white rounded-lg mb-2 shadow-sm`}>
            <View style={tw`p-3`}>
              <View style={tw`flex-row items-center`}>
                {/* Avatar */}
               {comment.user?.photoURL ? (
                 <Image 
                  source={{ uri: comment.user.photoURL }}
                  style={tw`w-10 h-10 rounded-full`}
                />
              ) : (
                <View style={tw`w-10 h-10 rounded-full bg-gray-300 items-center justify-center`}>
                  <Ionicons name="person" size={20} color="#FFF" />
                </View>
              )}
                
                <View style={tw`flex-1 ml-3`}>
                  <Text style={tw`text-gray-900 font-semibold text-sm`}>
                    {comment.user?.displayName || 'Utilisateur'}
                  </Text>
                  <Text style={tw`text-gray-500 text-xs`}>
                    {comment.createdAt ? formatTimeAgo(comment.createdAt):"A l'instant"}
                  </Text>
                </View>

               {/* Menu - Visible seulement si l'utilisateur peut supprimer */}
{canDelete(comment) && (
  <>
    <TouchableOpacity 
      style={tw`p-2`}
      onPress={() => setMenuVisible(showMenu ? null : comment.id)}
    >
      <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
    </TouchableOpacity>

    {/* Menu contextuel avec Modal */}
    <Modal
      visible={showMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setMenuVisible(null)}
    >
      {/* Backdrop transparent pour fermer */}
      <Pressable 
        style={tw`flex-1`}
        onPress={() => setMenuVisible(null)}
      >
        {/* Positionnement du menu */}
        <View style={tw`flex-1 items-end justify-start pt-20 pr-5`}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={tw`bg-white rounded-2xl shadow-2xl min-w-48 overflow-hidden`}>
              {/* Option Supprimer */}
              <TouchableOpacity
                style={tw`flex-row items-center px-5 py-4 ${deleting ? 'bg-gray-50' : 'active:bg-gray-50'}`}
                onPress={() => handleDelete(comment.id)}
                disabled={deleting}
                activeOpacity={0.7}
              >
                {deleting ? (
                  <>
                    <ActivityIndicator size="small" color="#EF4444" />
                    <Text style={tw`text-gray-500 font-medium ml-3 text-sm`}>
                      Suppression...
                    </Text>
                  </>
                ) : (
                  <>
                    <View style={tw`w-9 h-9 rounded-full bg-red-50 items-center justify-center`}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </View>
                    <Text style={tw`text-gray-900 font-medium ml-3 text-sm`}>
                      Supprimer
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={tw`h-px bg-gray-100 mx-3`} />

              {/* Option Annuler */}
              <TouchableOpacity
                style={tw`flex-row items-center px-5 py-4 active:bg-gray-50`}
                onPress={() => setMenuVisible(null)}
                activeOpacity={0.7}
              >
                <View style={tw`w-9 h-9 rounded-full bg-gray-100 items-center justify-center`}>
                  <Ionicons name="close-outline" size={18} color="#6B7280" />
                </View>
                <Text style={tw`text-gray-600 font-medium ml-3 text-sm`}>
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  </>
)}

              </View>

              {/* Contenu */}
              <Text style={tw`text-gray-900 text-sm mt-3 leading-5`}>
                {comment.contenu}
              </Text>

              {/* Réaction */}
              <View style={tw`flex-row items-center mt-3`}>
                <View style={tw`${reaction.bg} px-3 py-1 rounded-full flex-row items-center`}>
                  <Text style={tw`text-base mr-1`}>{reaction.emoji}</Text>
                  <Text style={tw`text-xs font-medium`} >
                    {comment.satisfaction === 'decevant' ? 'Décevant' : 
                     comment.satisfaction === 'excellent' ? 'Excellent' : 'Moyen'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
