import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { useSocket } from "@/src/contexts/socketContext"; 
import { getAllNotification, markNotificationAsRead, removeNotification } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext"; 
import { Notification } from "@/src/type/notificationType";

export default function NotificationScreen() {
  const { notifications, markAsRead, clearAll } = useSocket();
  
  // Récupération du rôle utilisateur
  const { userRole } = useAuth(); 

  const [loading, setLoading] = useState(false);
  const [allNotifs, setAllNotifs] = useState<Notification[]>([]);

  // Chargement initial API + Fusion Socket
  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true);
      try {
        console.log("Chargement historique API...");
        const apiData = await getAllNotification();
        
        setAllNotifs(prev => {
            // Fusion API + Socket
            const combined = [...notifications, ...apiData];
            const uniqueMap = new Map();
            combined.forEach(item => uniqueMap.set(item.id || Math.random(), item));
            const unique = Array.from(uniqueMap.values());
            
            // Tri décroissant par date
            return unique.sort((a, b) => {
                const dateA = new Date(a.date || a.createdAt || 0).getTime();
                const dateB = new Date(b.date || b.createdAt || 0).getTime();
                return dateB - dateA;
            });
        });
      } catch (error) {
        console.error("Erreur chargement API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApiData();
  }, []); 

  // Synchronisation temps réel
  useEffect(() => {
    if (notifications.length > 0) {
        setAllNotifs(prev => {
             const newSocketNotifs = notifications.filter(n => !prev.find(p => p.id === n.id));
             return [...newSocketNotifs, ...prev];
        });
    }
  }, [notifications]);


    const handleMarkAsRead = async (item: Notification) => {
      setAllNotifs(prev => prev.map(n => 
          n.id === item.id ? { ...n, isRead: true } : n
      ));

      // Mise à jour du Context (pour le badge)
      const contextIndex = notifications.findIndex(n => n.id === item.id);
      if (contextIndex !== -1) markAsRead(contextIndex);
      if (item.id && !item.isRead) {
          try {
              await markNotificationAsRead(item.id);
              console.log("Notif marquée lue en base");
          } catch (e) {
              console.error("Erreur lors du marquage lu", e);
              // Optionnel : Revert l'état si ça échoue
          }
      }
  };

  // LOGIQUE DE SUPPRESSION
  const handleDelete = async (id: number) => {
      Alert.alert(
          "Supprimer",
          "Voulez-vous vraiment supprimer cette notification ?",
          [
              { text: "Annuler", style: "cancel" },
              {
                  text: "Supprimer",
                  style: "destructive",
                  onPress: async () => {
                      try {
                          // Suppression API
                          await removeNotification(id);
                          // Mise à jour locale immédiate
                          setAllNotifs(prev => prev.filter(n => n.id !== id));
                      } catch (error) {
                          Alert.alert("Erreur", "Impossible de supprimer la notification");
                      }
                  }
              }
          ]
      );
  };

   const handleClearAll = () => {
      clearAll(); // Vide le context (Badge -> 0)
      // Marque tout comme lu localement sans supprimer
      setAllNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };


  const filteredNotifications = allNotifs.filter(n => {
      const title = (n.title || "").toLowerCase();
      
      // Cas ADMIN : Création de ligne
      const adminKeywords = ["nouvelle ligne", "nouveelle ligne"]; 
      const isAdminNotif = adminKeywords.some(k => title.includes(k));

      if (isAdminNotif) {
          return userRole === "admin";
      }

      //  Cas USER : Changement de statut
      // On définit les mots clés pour le changement de statut
      const userKeywords = ["changement de statut", "statut modifié"];
      const isUserNotif = userKeywords.some(k => title.includes(k));

      if (isUserNotif) {
          // Si c'est un changement de statut, SEUL le 'user' peut le voir
          // (L'admin ne le verra pas, car c'est lui qui l'a fait)
          return userRole === "user";
      }
      //  Autres notifications (Info générale, maintenance...)
      // Visible par tout le monde
      return true;
  });


  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "d MMM yyyy 'à' HH:mm", { locale: fr });
    } catch (e) { return "-"; }
  };

  // Rendu d'une notification
   const renderNotification = ({ item, index }: { item: Notification; index: number }) => (
    <TouchableOpacity
      style={tw`${item.isRead ? "bg-white" : "bg-blue-50"} p-4 rounded-xl mb-3 border border-gray-100 shadow-sm`}
      onPress={() => handleMarkAsRead(item)} 
      
      onLongPress={() => item.id && handleDelete(item.id)}
      activeOpacity={0.7}
    >
      <View style={tw`flex-row items-start`}>
        <Ionicons name="notifications" size={32} color="#3b82f6" style={tw`mr-3`} />
        
        <View style={tw`flex-1`}>
          <Text style={tw`text-gray-800 font-bold mb-1`}>{item.title}</Text>
          <Text style={tw`text-gray-600 mb-2`}>{item.message}</Text>
          {item.ligne && (
            <View style={tw`bg-gray-100 self-start px-2 py-1 rounded mb-2`}>
              <Text style={tw`text-xs text-gray-700`}>
                Ligne: {item.ligne.nom || item.ligne.nom_ligne}
              </Text>
            </View>
          )}
          <Text style={tw`text-xs text-gray-400`}>
            {formatDate(item.date || item.createdAt)}
          </Text>
        </View>
        
        {/* Colonne Actions (Lu / Supprimer) */}
        <View style={tw`flex justify-between items-end ml-2`}>
            {!item.isRead ? (
                 <View style={tw`w-2 h-2 bg-blue-500 rounded-full mb-2`} />
            ) : <View style={tw`w-2 h-2`} />}
            
            {item.id && (
                <TouchableOpacity onPress={() => handleDelete(item.id!)} style={tw`p-1`}>
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
            )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* En-tête */}
           <View style={tw`flex-row justify-between items-center px-6 mt-10 py-4 bg-white`}>
         <Text style={tw`text-xl font-bold`}>Notifications</Text>
         {/* Affiche le bouton seulement s'il y a des non-lues */}
         {allNotifs.some(n => !n.isRead) && (
             <TouchableOpacity onPress={handleClearAll}>
                <Text style={tw`text-blue-500 font-semibold`}>Tout marquer lu</Text>
             </TouchableOpacity>
         )}
      </View>


     
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={tw`mt-10`} />
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item, i) => item.id ? item.id.toString() : `n-${i}`}
          contentContainerStyle={tw`p-4`}
          ListEmptyComponent={
              <Text style={tw`text-center text-gray-400 mt-10`}>Aucune notification</Text>
          }
        />
      )}
    </View>
  );
}
