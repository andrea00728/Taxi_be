import CountLigne from "@/src/components/Admin/countlignebydistrict";
import Statistique from "@/src/components/Admin/statistique";
import { useLogout } from "@/src/utils/logout";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View, Text, TouchableOpacity, Keyboard, StyleSheet } from "react-native";
import tw from "twrnc";

export default function DashboardAdmin() {
  const { handleLogout } = useLogout();
  
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* ScrollView avec le contenu */}
      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-6 pb-24`}>
          
          <Text style={tw`text-gray-500 mb-6`}>
            Vue d'ensemble des statistiques
          </Text>

          <Statistique />
          <CountLigne />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => {
          Keyboard.dismiss();
          handleLogout();
        }}
        style={[
          tw`w-14 h-14 bg-red-600 rounded-full items-center justify-center`,
          styles.floatingButton
        ]}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Ombre pour Android
  }
});
