import { useAuth } from "@/src/contexts/AuthContext";
import CompteAdmin from "@/src/screens/AdminScreens/compteAdmin";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Modal, Pressable, Text, useWindowDimensions, View,StyleSheet } from "react-native";
import tw from "twrnc";

/**
 * Bouton pour ouvrir la modale d'enregistrement du nouvelle admin ,
 * La modale est composée d'un écran deécran d'inscription.
 * Lorsque le bouton est pressé, la modale s'ouvre.
 * Lorsque le token est reçu, le token est sauvegardé dans le contexte.
 */
export default function ButtonCreatAdmin() {
  const [visible, setVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  const { height, width } = useWindowDimensions();
  const { login } = useAuth();

  const open = useCallback(() => setVisible(true), []);
  
  const close = useCallback(() => {
    setVisible(false);
    setCurrentScreen('login');
  }, []);

  const handleLogin = useCallback((token: string) => {
    console.log("Token reçu, sauvegarde dans le contexte...", token);
    
    // Sauvegarder le token (le rôle sera extrait automatiquement)
    login(token);
    
    // Fermer la modale
    setVisible(false);
    setCurrentScreen('login');
    
    // La navigation se fera automatiquement via le Stack.Navigator conditionnel
  }, [login]);

  const goToRegister = useCallback(() => {
    setCurrentScreen('register');
  }, []);

  const goToLogin = useCallback(() => {
    setCurrentScreen('login');
  }, []);

  const modalHeight = height * 0.4;
  const modalWidth = width > 600 ? 500 : width * 0.9; // Responsive pour tablettes

  return (
    <View>
      <Pressable
        style={[tw`bg-yellow-400 px-2 w-23 ml-auto   py-2 rounded-full flex-row items-center `,styles.floatingButton]}
        
        android_ripple={{ color: "#f1f1f1" }}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir enregistrement admi"
      >
        <Text style={tw`text-white font-bold text-sm`}>admin</Text>
        <Ionicons name="lock-closed-outline" size={15} color="white" style={tw`ml-2`} />
      </Pressable>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={close}
        statusBarTranslucent
      >

        <Pressable 
          style={tw`flex-1 bg-black/50 justify-center items-center px-4`} 
          onPress={close}
        >
          <Pressable 
            onPress={(e) => e.stopPropagation()}
            style={tw`w-full max-w-md`}
          >
            <View 
              style={[
                tw`bg-white rounded-3xl shadow-2xl`,
                { 
                  minHeight: modalHeight, 
                  maxHeight: height * 0.85,
                  width: modalWidth 
                }
              ]}
            >
              {/* Header avec bouton fermer */}
              <View style={tw`flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-gray-200`}>
                <Pressable 
                  onPress={close} 
                  accessibilityRole="button" 
                  accessibilityLabel="Fermer"
                  hitSlop={{ top: 10, bottom: 10, left: 20, right: 10 }}
                  style={tw`p-1`}
                >
                  <Ionicons name="close-circle" size={28} color="#6B7280" />
                </Pressable>
              </View>
              
              {/* Contenu du modal */}
              <View style={tw`flex-1 px-5 py-4`}>
                <CompteAdmin
                  onRegistered={goToLogin}
                  goToLogin={goToLogin}
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Ombre pour Android
  }
});