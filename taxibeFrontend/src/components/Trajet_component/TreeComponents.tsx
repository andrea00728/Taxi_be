import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import tw from "twrnc";

interface TreeNodeProps {
  icon: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  badge?: string;
  isStart?: boolean;
  isEnd?: boolean;
  isBus?: boolean;
  isTransfer?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ 
  icon, 
  iconColor, 
  title, 
  subtitle, 
  badge, 
  isStart, 
  isEnd, 
  isBus,
  isTransfer 
}) => (
  <View style={tw`flex-row items-center py-2`}>
    <View style={tw`w-10 h-10 rounded-full items-center justify-center mr-3 ${
      isStart ? 'bg-green-100' : 
      isEnd ? 'bg-red-100' : 
      isBus ? 'bg-yellow-100' : 
      'bg-blue-100'
    }`}>
      <Ionicons name={icon as any} size={20} color={iconColor} />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-sm font-semibold text-gray-800`}>{title}</Text>
      {subtitle && (
        <Text style={tw`text-xs text-gray-500 mt-0.5`}>{subtitle}</Text>
      )}
    </View>
    {badge && (
      <View style={tw`bg-yellow-400 px-2 py-1 rounded-full`}>
        <Text style={tw`text-white text-xs font-bold`}>{badge}</Text>
      </View>
    )}
  </View>
);

export const TreeBranch: React.FC = () => (
  <View style={tw`ml-5 w-0.5 h-6 bg-gray-300`} />
);
