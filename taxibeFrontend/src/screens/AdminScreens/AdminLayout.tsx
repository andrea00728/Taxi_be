
import { useAuth } from '@/src/contexts/AuthContext';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold`}>AdminLayout</Text>
      
      <Pressable 
        onPress={logout}
        style={tw`bg-red-500 px-4 py-2 rounded-lg mt-4`}
      >
        <Text style={tw`text-white font-bold`}>Déconnexion</Text>
      </Pressable>
    </View>
  );
}
