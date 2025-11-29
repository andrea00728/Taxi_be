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

/**
 * TreeNode component
 * 
 * @param {TreeNodeProps} props - The props to pass to the component
 * @param {string} props.icon - The icon to display
 * @param {string} props.iconColor - The color of the icon
 * @param {string} props.title - The title of the node
 * @param {string} [props.subtitle] - The subtitle of the node
 * @param {string} [props.badge] - The badge to display
 * @param {boolean} [props.isStart=false] - If the node is the start of a journey
 * @param {boolean} [props.isEnd=false] - If the node is the end of a journey
 * @param {boolean} [props.isBus=false] - If the node is a bus stop
 * @param {boolean} [props.isTransfer=false] - If the node is a transfer stop
 */
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
