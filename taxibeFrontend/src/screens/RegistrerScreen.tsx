import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { url } from "../utils/url";

/**
 * Écran d'inscription.
 * 
 * @param {onRegistered?: (uid: string) => void} - Fonction appelée lorsque le compte est créé.
 * @param {goToLogin?: () => void} - Fonction appelée lorsque le bouton "Connexion" est pressé.
 * 
 * @returns Un JSX.Element qui représente l'écran d'inscription.
 */
export default function RegisterScreen({ 
  onRegistered, 
  goToLogin 
}: {
  onRegistered?: (uid: string) => void;
  goToLogin?: () => void;
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
    if (!email) { 
      Alert.alert("Erreur", "Email requis"); 
      return; 
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${url}/auth/send-confirmation`, { email, role: "user" });
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

/**
 * Vérifie le code de vérification envoyé par email.
 * Si le code est valide, le compte est créé, onRegistered est appelé avec l'UID du compte créé.
 * Si une erreur survient, un message d'erreur est affiché.
 * Enfin, l'indicateur de chargement est réinitialisé à false.
 */
  async function handleVerifyCode() {
    if (!code) { 
      Alert.alert("Erreur", "Code requis"); 
      return; 
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${url}/auth/confirm`, { email, code });
      if (res.status === 200) {
        Alert.alert("Compte créé", "Inscription réussie");
        onRegistered?.(res.data?.uid);
        goToLogin?.();
      } else {
        Alert.alert("Erreur", "Code invalide.");
      }
    } catch (e: any) {
      Alert.alert("Erreur", e.response?.data?.error || "Erreur réseau.");
    }
    setIsLoading(false);
  }

/**
 * Envoie un nouveau code de vérification par email.
 * Si le code est envoyé avec succès, un message d'alerte est affiché avec le message "Un nouveau code a été envoyé.".
 * Si une erreur survient, un message d'erreur est affiché avec le message "Impossible de renvoyer le code.".
 * Enfin, l'indicateur de chargement est réinitialisé à false.
 */
  async function handleResend() {
    if (!email) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${url}/auth/resend-otp`, { email });
      if (res.status === 200) {
        Alert.alert("Nouveau code", "Un nouveau code a été envoyé.");
      } else {
        Alert.alert("Erreur", "Impossible de renvoyer le code.");
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
            <Text style={tw`text-white font-bold`}>Créer un compte</Text>
          </View>
           <View style={tw`bg-gray-300 self-end rounded-lg px-4 py-2 mb-4`}>
          <Text style={tw`text-gray-500 font-bold`}>
            Rejoignez-nous et débloquez toutes les fonctionnalités personnalisées selon vos autorisations.
          </Text>

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

              <Pressable 
                onPress={handleResend} 
                style={tw`self-center mt-3`} 
                accessibilityRole="button" 
                disabled={isLoading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={tw`text-[#FCB53B]`}>Renvoyer le code</Text>
              </Pressable>
            </>
          )}

          <View style={tw`flex-row justify-center mt-3`}>
            <Text style={tw`text-gray-600`}>Déjà un compte ? </Text>
            <Pressable 
              onPress={goToLogin} 
              accessibilityRole="link"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={tw`text-[#FCB53B] font-semibold`}>Connexion</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
