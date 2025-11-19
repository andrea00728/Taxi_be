import { View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import tw from "twrnc";
import { countLigneByDistrict, getDistricts } from "@/src/services/api";

interface District {
  id: number;
  nom: string;
  count: number;
}

export default function CountLigne() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDistrictsWithCount = async () => {
      try {
        setLoading(true);
        
        // Récupère tous les districts
        const allDistricts = await getDistricts();
        
        if (!allDistricts || allDistricts.length === 0) {
          if (isMounted) {
            setError("Aucun district disponible");
            setLoading(false);
          }
          return;
        }

        // Pour chaque district, récupère le count depuis l'API
        const districtsWithCount = await Promise.all(
          allDistricts.map(async (district) => {
            try {
              // L'API retourne {count: number, nom: string}
              const response = await countLigneByDistrict(district.id);
              
              return {
                id: district.id,
                nom: response.nom, // Utilise le nom de la réponse API
                count: response.count // Utilise le count de la réponse API
              };
            } catch (err) {
              console.error(`Erreur pour le district ${district.id}:`, err);
              return {
                id: district.id,
                nom: district.nom,
                count: 0
              };
            }
          })
        );
        
        if (isMounted) {
          setDistricts(districtsWithCount);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Erreur lors du chargement des données");
          console.error("Erreur districts:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDistrictsWithCount();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading === true) {
    return (
      <View style={tw`flex-1 justify-center items-center py-10`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={tw`mt-4 text-gray-600`}>Chargement...</Text>
      </View>
    );
  }

  if (error !== null) {
    return (
      <View style={tw`flex-1 justify-center items-center py-10`}>
        <Text style={tw`text-red-500 text-lg`}>{error}</Text>
      </View>
    );
  }

  if (!Array.isArray(districts) || districts.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center py-10`}>
        <Text style={tw`text-gray-500 text-lg`}>Aucun district trouvé</Text>
      </View>
    );
  }

  const maxCount = Math.max(...districts.map(d => d.count), 1);

  return (
    <View style={tw`mb-6`}>
      {/* <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>
        Lignes par District
      </Text> */}

      {districts.map((district, index) => {
        const percentage = (district.count / maxCount) * 100;
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        
        return (
          <View 
            key={`district-${district.id}`}
            style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100`}
          >
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <Text style={tw`text-gray-800 font-semibold text-base`}>
                {district.nom}
              </Text>
              <Text style={tw`text-gray-800 font-bold text-lg`}>
                {district.count}
              </Text>
            </View>

            <View style={tw`bg-gray-100 h-3 rounded-full overflow-hidden`}>
              <View 
                style={{
                  height: '100%',
                  width: `${percentage}%`,
                  borderRadius: 9999,
                  backgroundColor: colors[index % 5]
                }}
              />
            </View>

            <Text style={tw`text-gray-500 text-xs mt-2 text-right`}>
              {percentage.toFixed(1)}% du maximum
            </Text>
          </View>
        );
      })}
    </View>
  );
}
