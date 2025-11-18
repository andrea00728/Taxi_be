import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import tw from "twrnc";

import { TreeBranch, TreeNode } from "./TreeComponents";
import { calculateDistance } from "@/src/utils/distanceCalculator";
import { Route } from "@/src/type/trajetType";

interface RouteTreeCardProps {
  route: Route & { totalTarif: number };
  index: number;
}

const RouteTreeCard: React.FC<RouteTreeCardProps> = React.memo(({ route, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <View style={tw`bg-white rounded-xl mb-4 border-2 ${
      route.type === 'direct' ? 'border-green-400' : 'border-blue-400'
    } overflow-hidden`}>
      
      <TouchableOpacity 
        onPress={() => setExpanded(!expanded)}
        style={tw`p-4 ${route.type === 'direct' ? 'bg-green-50' : 'bg-blue-50'}`}
      >
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row items-center flex-1`}>
            <View style={tw`px-3 py-1.5 rounded-full ${
              route.type === 'direct' ? 'bg-green-500' : 'bg-blue-500'
            } mr-3`}>
              <Text style={tw`text-white text-xs font-bold`}>
                {route.type === 'direct' ? ' Direct' : ` ${route.transferCount} corresp.`}
              </Text>
            </View>
            <View>
              <Text style={tw`text-base font-bold text-gray-800`}>
                {Math.round(route.totalDistance)}m
              </Text>
              {route.walkingDistance && route.walkingDistance > 0 && (
                <Text style={tw`text-xs text-gray-600`}>
                  🚶 {Math.round(route.walkingDistance)}m à pied
                </Text>
              )}
            </View>
          </View>
          
          <View style={tw`flex-row items-center`}>
            <View style={tw`bg-yellow-400 px-3 py-1.5 rounded-full mr-2`}>
              <Text style={tw`text-white text-xs font-bold`}>
                {route.totalTarif} Ar
              </Text>
            </View>
            <Ionicons 
              name={expanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#6B7280" 
            />
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={tw`p-4 bg-white`}>
          <View style={tw`mb-4`}>
            {route.lignes.map((ligne, ligneIdx) => (
              <View key={ligne.id}>
                {ligneIdx === 0 && (
                  <TreeNode 
                    icon="location"
                    iconColor="#10B981"
                    title={route.arrets[0]?.nom || "Départ"}
                    isStart
                  />
                )}

                <TreeBranch />
                <TreeNode 
                  icon="bus"
                  iconColor="#F59E0B"
                  title={ligne.nom}
                  subtitle={`${ligne.depart} → ${ligne.terminus}`}
                  badge={`${ligne.tarif} Ar`}
                  isBus
                />

                {ligneIdx < route.lignes.length - 1 && (
                  <>
                    <TreeBranch />
                    <TreeNode 
                      icon="swap-vertical"
                      iconColor="#3B82F6"
                      title={route.arrets[ligneIdx + 1]?.nom || "Correspondance"}
                      subtitle={`🚶 Marcher ${Math.round(
                        calculateDistance(
                          route.arrets[ligneIdx + 1],
                          route.arrets[ligneIdx + 2]
                        )
                      )}m`}
                      isTransfer
                    />
                  </>
                )}

                {ligneIdx === route.lignes.length - 1 && (
                  <>
                    <TreeBranch />
                    <TreeNode 
                      icon="flag"
                      iconColor="#EF4444"
                      title={route.arrets[route.arrets.length - 1]?.nom || "Arrivée"}
                      isEnd
                    />
                  </>
                )}
              </View>
            ))}
          </View>

          <View style={tw`bg-gray-50 rounded-lg p-3 border border-gray-200`}>
            <Text style={tw`text-sm font-bold text-gray-700 mb-2`}>
              Instructions
            </Text>
            {route.instructions.map((instruction, idx) => (
              <Text key={idx} style={tw`text-xs text-gray-600 mb-1`}>
                {instruction}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
});

export default RouteTreeCard;
