import CountLigne from "@/src/components/Admin/countlignebydistrict";
import Statistique from "@/src/components/Admin/statistique";
import { ScrollView, View, Text } from "react-native";
import tw from "twrnc";

export default function DashboardAdmin() {
  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-6`}>
        {/* Header */}
        <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
          Dashboard Admin
        </Text>
        <Text style={tw`text-gray-500 mb-6`}>
          Vue d'ensemble des statistiques
        </Text>

        {/* Statistiques Cards */}
        <Statistique />

        {/* Graphique à barres */}
        <CountLigne />
      </View>
    </ScrollView>
  );
}
