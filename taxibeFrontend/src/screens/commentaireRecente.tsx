import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { getComsByLigne, removeCommentaire } from "../services/api";
import { commentaire } from "../type/comsType";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from 'jwt-decode';

interface CommentaireRecenteProps {
  ligneId: number;
  refreshTrigger: number;
  onCommentDeleted: () => void;
  onSeeAll?: () => void; 
}

interface DecodedToken {
  uid: string;
  role: string;
}

export default function CommentaireRecente({ 
  ligneId, 
  refreshTrigger, 
  onCommentDeleted,
  onSeeAll 
}: CommentaireRecenteProps) {
  const [recentComment, setRecentComment] = useState <commentaire | null>(null);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
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
      setTotalComments(data.length);
      
      //  Trier par date décroissante et prendre le plus récent
      if (data.length > 0) {
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Le plus récent en premier
        });
        setRecentComment(sorted[0]);
      } else {
        setRecentComment(null);
      }
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

  const canDelete = (comment: commentaire): boolean => {
    const currentUid = getCurrentUserUid();
    if (!currentUid) return false;
    return comment.firebase_uid === currentUid || userRole === 'admin';
  };

  const handleDelete = async () => {
    if (!recentComment) return;

    Alert.alert(
      "Supprimer le commentaire",
      "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      [
        {
          text: "Annuler",
          style: "cancel",
          onPress: () => setMenuVisible(false)
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await removeCommentaire(recentComment.id);
              Alert.alert("Succès", "Commentaire supprimé avec succès");
              setMenuVisible(false);
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
      <View style={tw`bg-white rounded-lg p-4 items-center`}>
        <ActivityIndicator size="small" color="#1877F2" />
      </View>
    );
  }

  if (!recentComment) {
    return (
      <View style={tw`bg-white rounded-lg p-4 items-center`}>
        <Ionicons name="chatbubbles-outline" size={40} color="#D1D5DB" />
        <Text style={tw`text-gray-500 mt-2 text-sm text-center`}>
          Aucun avis pour le moment
        </Text>
      </View>
    );
  }

  const reaction = getSatisfactionEmoji(recentComment.satisfaction);

  return (
    <View style={tw`bg-white rounded-lg shadow-sm`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100`}>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="chatbubble-ellipses" size={18} color="#1877F2" />
          <Text style={tw`text-gray-900 font-bold text-sm ml-2`}>
            Dernier avis
          </Text>
          {totalComments > 1 && (
            <View style={tw`bg-blue-100 rounded-full px-2 py-0.5 ml-2`}>
              <Text style={tw`text-blue-600 text-xs font-semibold`}>
                +{totalComments - 1}
              </Text>
            </View>
          )}
        </View>

        {onSeeAll && totalComments > 1 && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={tw`text-blue-500 text-xs font-semibold`}>
              Voir tout
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Commentaire */}
      <View style={tw`p-4`}>
        <View style={tw`flex-row items-start`}>
          {/* Avatar */}
          <View style={tw`w-10 h-10 rounded-full bg-gray-300 items-center justify-center`}>
            <Ionicons name="person" size={18} color="#FFF" />
          </View>

          <View style={tw`flex-1 ml-3`}>
            {/* En-tête */}
            <View style={tw`flex-row items-center justify-between mb-1`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-gray-900 font-semibold text-sm`}>
                  Utilisateur
                </Text>
                <Text style={tw`text-gray-500 text-xs`}>
                  {recentComment.createdAt ? formatTimeAgo(recentComment.createdAt) : "À l'instant"}
                </Text>
              </View>

              {/* Menu */}
              {canDelete(recentComment) && (
                <>
                  <TouchableOpacity 
                    style={tw`p-1`}
                    onPress={() => setMenuVisible(true)}
                  >
                    <Ionicons name="ellipsis-horizontal" size={18} color="#65676B" />
                  </TouchableOpacity>

                  <Modal
                    visible={menuVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                  >
                    <Pressable 
                      style={tw`flex-1`}
                      onPress={() => setMenuVisible(false)}
                    >
                      <View style={tw`flex-1 items-end justify-start pt-20 pr-5`}>
                        <Pressable onPress={(e) => e.stopPropagation()}>
                          <View style={tw`bg-white rounded-2xl shadow-2xl min-w-48 overflow-hidden`}>
                            <TouchableOpacity
                              style={tw`flex-row items-center px-5 py-4 ${deleting ? 'bg-gray-50' : 'active:bg-gray-50'}`}
                              onPress={handleDelete}
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

                            <View style={tw`h-px bg-gray-100 mx-3`} />

                            <TouchableOpacity
                              style={tw`flex-row items-center px-5 py-4 active:bg-gray-50`}
                              onPress={() => setMenuVisible(false)}
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
            <Text 
              style={tw`text-gray-800 text-sm leading-5 mb-2`}
              numberOfLines={3}
            >
              {recentComment.contenu}
            </Text>

            {/* Badge satisfaction */}
            <View style={tw`${reaction.bg} self-start px-3 py-1 rounded-full flex-row items-center`}>
              <Text style={tw`text-base mr-1`}>{reaction.emoji}</Text>
              <Text style={tw`text-xs font-medium`} >
                {recentComment.satisfaction === 'decevant' ? 'Décevant' : 
                 recentComment.satisfaction === 'excellent' ? 'Excellent' : 'Moyen'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
