import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { url } from "../utils/url";


export default function LoginScreen({
  onLoginSuccess,
  onForgotPassword,
  onGoRegister,
}: {
  onLoginSuccess?: (token: string) => void;
  onForgotPassword?: () => void;
  onGoRegister?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const codeRef = useRef<TextInput>(null);



/**
 * Envoie un code de vérification par email.
 * Si le code est envoyé avec succès, le champ de code est mis en focus.
 * Si une erreur survient, un message d'erreur est affiché.
 * Enfin, l'indicateur de chargement est réinitialisé à false.
 */
  async function handleSendCode() {
    setIsLoading(true);
    try {
      const res = await axios.post(`${url}/auth/login`, { email });
      if (res.status === 200) {
        setStep("otp");
        setTimeout(() => codeRef.current?.focus(), 100);
        Alert.alert("Succès", "Code envoyé par email.");
      } else {
        Alert.alert("Erreur", "Impossible d'envoyer le code.");
      }
    } catch (e: any) {
      Alert.alert("Erreur", e.response?.data?.error || "Erreur réseau.");
    }
    setIsLoading(false);

  }


  
  //   async function handleVerifyCode() {
  //   if (!code) { 
  //     Alert.alert("Erreur", "Veuillez saisir le code reçu."); 
  //     return; 
  //   }
  //   setIsLoading(true);
  //   try {
  //     const res = await axios.post(`${url}/auth/verify-otp`, { email, code });
  //     if (res.status === 200) {
  //       onLoginSuccess?.(res.data.token);
  //     } else {
  //       Alert.alert("Erreur", "Code invalide.");
  //     }
  //   } catch (e: any) {
  //     Alert.alert("Erreur", e.response?.data?.error || "Erreur réseau.");
  //   }
  //   setIsLoading(false);
  // }


  async function handleVerifyCode() {
  if (!code) { 
    Alert.alert("Erreur", "Veuillez saisir le code reçu."); 
    return; 
  }
  setIsLoading(true);
  try {
    const res = await axios.post(`${url}/auth/verify-otp`, { email, code });
    
    if (res.status === 200) {
      // Récupérer le token et le rôle de la réponse
      const { token, role } = res.data;
      
      console.log("Token et rôle reçus:", { token, role });
      onLoginSuccess?.(token);
    } else {
      Alert.alert("Erreur", "Code invalide.");
    }
  } catch (e: any) {
    Alert.alert("Erreur", e.response?.data?.error || "Erreur réseau.");
  }
  setIsLoading(false);
}


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`flex-grow`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`flex-1 bg-white px-1`}>
          <View style={tw`bg-yellow-400 self-start rounded-full px-4 py-2 mb-4`}>
            <Text style={tw`text-white font-bold`}>Login</Text>
          </View>
           <View style={tw`bg-gray-300 self-end rounded-lg px-4 py-2 mb-4`}>
            <Text style={tw`text-gray-500 font-bold`}>conntecter vous avec votre compte utilisateur ou admin  avec l'authorisation de votre compte qu'il convient</Text>
          </View>
          {step === "email" ? (
            <>
              <Text style={tw`text-gray-700 mb-2 font-medium`}>Email</Text>
              <View style={tw`flex-row items-center bg-white border border-[#FCB53B] rounded-xl px-3 h-12 mb-4`}>
                <Ionicons name="mail-outline" size={20} color="#FCB53B" />
                <TextInput
                  style={tw`flex-1 px-3 text-base text-gray-900`}
                  placeholder="exemple@domaine.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="username"
                  returnKeyType="done"
                  onSubmitEditing={handleSendCode}
                  accessibilityLabel="Champ email"
                  editable={!isLoading}
                />
              </View>

              <Pressable
                onPress={handleSendCode}
                style={tw`bg-yellow-400 h-12 rounded-xl items-center justify-center`}
                accessibilityRole="button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={tw`text-white font-bold text-base`}>Envoyer le code</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={tw`text-gray-700 mb-2 font-medium`}>Code de confirmation</Text>
              <View style={tw`flex-row items-center bg-white border border-[#FCB53B] rounded-xl px-3 h-12 mb-4`}>
                <Ionicons name="key-outline" size={20} color="#FCB53B" />
                <TextInput
                  ref={codeRef}
                  style={tw`flex-1 px-3 text-base text-gray-900`}
                  placeholder="Saisissez le code reçu"
                  placeholderTextColor="#9CA3AF"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleVerifyCode}
                  accessibilityLabel="Champ code"
                  editable={!isLoading}
                />
              </View>

              <Pressable
                onPress={handleVerifyCode}
                style={tw`bg-[#FCB53B] h-12 rounded-xl items-center justify-center`}
                accessibilityRole="button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={tw`text-white font-bold text-base`}>Valider le code</Text>
                )}
              </Pressable>
            </>
          )}

          <Pressable 
            onPress={onForgotPassword} 
            accessibilityRole="link" 
            style={tw`self-end mt-3`}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
          </Pressable>

          <View style={tw`flex-row justify-center mt-3`}>
            <Text style={tw`text-gray-600`}>Pas de compte ? </Text>
            <Pressable 
              onPress={onGoRegister} 
              accessibilityRole="link"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={tw`text-[#FCB53B] font-semibold`}>Créer un compte</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


