import { View, Text, ActivityIndicator, Dimensions, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import tw from "twrnc";
import { countLigneByDistrict, getDistricts } from "@/src/services/api";
import { BarChart, PieChart } from "react-native-chart-kit";

interface StatistiqueData {
  totalLignes: number;
  moyenneLignes: number;
  districtMax: { nom: string; count: number };
  districtMin: { nom: string; count: number };
  allDistricts: Array<{ id: number; nom: string; count: number }>;
}

const screenWidth = Dimensions.get("window").width;

/**
 * Composant qui affiche des statistiques sur les lignes (nombre total, moyenne, district avec le plus de lignes, district avec le moins de lignes, etc.)
 * Utilise l'API pour récupérer les données
 * Affiche un message d'erreur si les données ne peuvent pas être récupérées
 * Affiche un indicateur de chargement si les données sont en train de chargement
 * Utilise un composant de barre pour afficher les données
 */
export default function Statistique() {
  const [stats, setStats] = useState<StatistiqueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

/**
 * Récupère les statistiques sur les lignes (nombre total, moyenne, district avec le plus de lignes, district avec le moins de lignes, etc.)
 * Utilise l'API pour récupérer les données
 * Affiche un message d'erreur si les données ne peuvent pas être récupérées
 * Affiche un indicateur de chargement si les données sont en train de chargement
 * Utilise un composant de barre pour afficher les données
 */
    const fetchStatistiques = async () => {
      try {
        setLoading(true);
        
        const allDistricts = await getDistricts();
        
        if (!allDistricts || allDistricts.length === 0) {
          if (isMounted) {
            setError("Aucun district disponible");
            setLoading(false);
          }
          return;
        }

        const counts = await Promise.all(
          allDistricts.map(async (district) => {
            try {
              const response = await countLigneByDistrict(district.id);
              return {
                id: district.id,
                nom: response.nom,
                count: response.count
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
            allDistricts: counts
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

  // Configuration du chart
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForLabels: {
      fontSize: 10
    }
  };

  // Données pour le Bar Chart
  const barChartData = {
    labels: stats.allDistricts.map(d => d.nom.substring(0, 8)),
    datasets: [{
      data: stats.allDistricts.map(d => d.count)
    }]
  };

  // Données pour le Pie Chart (Top 5 districts)
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const pieChartData = stats.allDistricts
    .slice(0, 5)
    .map((district, index) => ({
      name: district.nom,
      population: district.count,
      color: colors[index],
      legendFontColor: "#374151",
      legendFontSize: 12
    }));

  return (
    <ScrollView style={tw`flex-1`}>
      <View style={tw`mb-6`}>
        
        {/* Cards statistiques */}
        <View style={tw`flex-row flex-wrap -mx-2 mb-6`}>
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
        </View>

        {/* Bar Chart */}
        <View style={tw`bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100`}>
          <Text style={tw`text-gray-800 font-semibold text-base mb-3`}>
            Répartition par District
          </Text>
          <BarChart
            data={barChartData}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            showValuesOnTopOfBars={true}
            fromZero={true}
            style={{
              borderRadius: 12
            }}
          />
        </View>

        {/* Pie Chart */}
        <View style={tw`bg-white rounded-xl p-4 shadow-sm border border-gray-100`}>
          <Text style={tw`text-gray-800 font-semibold text-base mb-3`}>
            Top 5 Districts
          </Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute={false}
            style={{
              borderRadius: 12
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
