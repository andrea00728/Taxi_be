import React from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import tw from 'twrnc';
import { SelectOption } from '../hooks/useLocationData';

interface LocationSectionProps {
  provinces: SelectOption[];
  regions: SelectOption[];
  districts: SelectOption[];
  selectedProvince: number | null;
  selectedRegion: number | null;
  selectedDistrict: number | null;
  onProvinceChange: (value: number) => void;
  onRegionChange: (value: number) => void;
  onDistrictChange: (value: number) => void;
}

export const LocationSection = React.memo(({
  provinces,
  regions,
  districts,
  selectedProvince,
  selectedRegion,
  selectedDistrict,
  onProvinceChange,
  onRegionChange,
  onDistrictChange
}: LocationSectionProps) => (
  <View style={tw`mb-6`}>
    {/* Province */}
    <View style={tw`mb-4`}>
      <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
        Province 
      </Text>
      <Dropdown
        data={provinces}
        labelField="label"
        valueField="value"
        placeholder="Sélectionner une province"
        search
        searchPlaceholder="Rechercher..."
        value={selectedProvince}
        onChange={(item) => onProvinceChange(item.value)}
        style={tw`px-4 py-3 bg-gray-50 rounded-lg border border-gray-300`}
        containerStyle={tw`rounded-lg shadow-md`}
        placeholderStyle={tw`text-gray-400 text-sm`}
        selectedTextStyle={tw`text-gray-900 text-sm font-medium`}
        inputSearchStyle={tw`text-gray-800 h-10`}
        maxHeight={250}
      />
    </View>

    {/* Région */}
    <View style={tw`mb-4`}>
      <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
        Région
      </Text>
      <Dropdown
        data={regions}
        labelField="label"
        valueField="value"
        placeholder={
          selectedProvince 
            ? (regions.length > 0 ? "Sélectionner une région" : "Aucune région disponible")
            : "Sélectionner d'abord une province"
        }
        search
        searchPlaceholder="Rechercher..."
        value={selectedRegion}
        onChange={(item) => onRegionChange(item.value)}
        disable={!selectedProvince || regions.length === 0}
        style={tw`px-4 py-3 rounded-lg border ${
          selectedProvince && regions.length > 0
            ? "bg-gray-50 border-gray-300" 
            : "bg-gray-200 border-gray-300"
        }`}
        containerStyle={tw`rounded-lg shadow-md`}
        placeholderStyle={tw`text-gray-400 text-sm`}
        selectedTextStyle={tw`text-gray-900 text-sm font-medium`}
        inputSearchStyle={tw`text-gray-800 h-10`}
        maxHeight={250}
      />
    </View>

    {/* District */}
    <View style={tw`mb-4`}>
      <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
        District 
      </Text>
      <Dropdown
        data={districts}
        labelField="label"
        valueField="value"
        placeholder={
          selectedRegion 
            ? (districts.length > 0 ? "Sélectionner un district" : "Aucun district disponible")
            : "Sélectionner d'abord une région"
        }
        search
        searchPlaceholder="Rechercher..."
        value={selectedDistrict}
        onChange={(item) => onDistrictChange(item.value)}
        disable={!selectedRegion || districts.length === 0}
        style={tw`px-4 py-3 rounded-lg border ${
          selectedRegion && districts.length > 0
            ? "bg-gray-50 border-gray-300" 
            : "bg-gray-200 border-gray-300"
        }`}
        containerStyle={tw`rounded-lg shadow-md`}
        placeholderStyle={tw`text-gray-400 text-sm`}
        selectedTextStyle={tw`text-gray-900 text-sm font-medium`}
        inputSearchStyle={tw`text-gray-800 h-10`}
        maxHeight={250}
      />
    </View>
  </View>
));

