import { View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import tw from "twrnc";
import { countLigneByDistrict, getDistricts } from "@/src/services/api";

interface StatistiqueData {
  totalLignes: number;
  moyenneLignes: number;
  districtMax: { nom: string; count: number };
  districtMin: { nom: string; count: number };
}

export default function Statistique() {
  const [stats, setStats] = useState<StatistiqueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatistiques = async () => {
      try {
        setLoading(true);
        
        // 1. RÉCUPÈRE TOUS LES DISTRICTS DYNAMIQUEMENT
        const allDistricts = await getDistricts();
        
        if (!allDistricts || allDistricts.length === 0) {
          if (isMounted) {
            setError("Aucun district disponible");
            setLoading(false);
          }
          return;
        }

        // 2. POUR CHAQUE DISTRICT, RÉCUPÈRE LE COUNT
        const counts = await Promise.all(
          allDistricts.map(async (district) => {
            try {
              const count = await countLigneByDistrict(district.id);
              const validCount = typeof count === 'number' && !isNaN(count) ? count : 0;
              return {
                id: district.id,
                nom: district.nom,
                count: validCount
              };
            } catch (err) {
              console.error(`Erreur district ${district.id}:`, err);
              return {
                id: district.id,
                nom: district.nom,
                count: 0
              };
            }
          })
        );

        // 3. CALCUL DES STATISTIQUES
        const total = counts.reduce((sum, d) => sum + d.count, 0);
        const moyenne = counts.length > 0 ? total / counts.length : 0;
        const max = counts.reduce((prev, current) => 
          prev.count > current.count ? prev : current
        );
        const min = counts.reduce((prev, current) => 
          prev.count < current.count ? prev : current
        );

        if (isMounted) {
          setStats({
            totalLignes: total,
            moyenneLignes: moyenne,
            districtMax: max,
            districtMin: min,
          });
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Erreur lors du chargement des statistiques");
          console.error("Erreur stats:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStatistiques();

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

  if (error !== null || stats === null) {
    return (
      <View style={tw`flex-1 justify-center items-center py-10`}>
        <Text style={tw`text-red-500 text-lg`}>{error || "Aucune donnée"}</Text>
      </View>
    );
  }

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>
        Statistiques Globales
      </Text>
      
      <View style={tw`flex-row flex-wrap -mx-2`}>
        <View style={tw`w-1/2 px-2 mb-4`}>
          <View style={tw`bg-white rounded-xl p-5 shadow-sm border border-gray-100`}>
            <Text style={tw`text-gray-500 text-xs font-medium mb-2`}>
              TOTAL DE LIGNES
            </Text>
            <Text style={tw`text-gray-800 text-3xl font-bold`}>
              {stats.totalLignes}
            </Text>
          </View>
        </View>

        <View style={tw`w-1/2 px-2 mb-4`}>
          <View style={tw`bg-white rounded-xl p-5 shadow-sm border border-gray-100`}>
            <Text style={tw`text-gray-500 text-xs font-medium mb-2`}>
              MOYENNE
            </Text>
            <Text style={tw`text-gray-800 text-3xl font-bold`}>
              {stats.moyenneLignes.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={tw`w-1/2 px-2 mb-4`}>
          <View style={tw`bg-white rounded-xl p-5 shadow-sm border border-gray-100`}>
            <Text style={tw`text-gray-500 text-xs font-medium mb-2`}>
              MAXIMUM
            </Text>
            <Text style={tw`text-gray-800 text-xl font-bold mb-1`}>
              {stats.districtMax.nom}
            </Text>
            <Text style={tw`text-blue-600 text-2xl font-bold`}>
              {stats.districtMax.count}
            </Text>
          </View>
        </View>

        <View style={tw`w-1/2 px-2 mb-4`}>
          <View style={tw`bg-white rounded-xl p-5 shadow-sm border border-gray-100`}>
            <Text style={tw`text-gray-500 text-xs font-medium mb-2`}>
              MINIMUM
            </Text>
            <Text style={tw`text-gray-800 text-xl font-bold mb-1`}>
              {stats.districtMin.nom}
            </Text>
            <Text style={tw`text-orange-600 text-2xl font-bold`}>
              {stats.districtMin.count}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
