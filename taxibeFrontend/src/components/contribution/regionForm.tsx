// RegionForm.tsx
import { url } from "@/src/utils/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "twrnc";



interface SelectOption {
  label: string;
  value: any;
}

export default function RegionForm({ onCreated }: { onCreated: () => void }) {
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<SelectOption | null>(null);
  const [nomRegion, setNomRegion] = useState("");

  useEffect(() => {
    axios.get(`${url}/provinces`).then(res =>
      setProvinces(res.data.map((p: any) => ({ label: p.nom, value: p.id })))
    );
  }, []);

  const validerEtEnvoyer = () => {
    if (!selectedProvince || !nomRegion.trim()) return Alert.alert("Erreur", "Tous les champs doivent être remplis");

    axios
      .post(`${url}/regions/create`, {
        nom: nomRegion,
        province_id: selectedProvince.value,
      })
      .then(() => {
        Alert.alert("Succès", "Région créée !");
        setNomRegion("");
        setSelectedProvince(null);
        onCreated();
      })
      .catch(() => Alert.alert("Erreur", "Erreur lors de la création"));
  };

  return (
    <View>
      <View style={tw`flex-row mb-5`}>
        <View style={tw`flex-1 mr-2`}>
          <Text style={tw`text-sm font-semibold mb-1 text-gray-700`}>Province</Text>
          <Dropdown
            data={provinces}
            labelField="label"
            valueField="value"
            placeholder="Sélection"
            value={selectedProvince}
            onChange={(item: SelectOption) => setSelectedProvince(item)}
            style={tw`bg-gray-100 rounded-md border border-gray-300`}
            selectedTextStyle={tw`text-gray-900`}
          />
        </View>

        <View style={tw`flex-1`}>
          <Text style={tw`text-sm font-semibold mb-1 text-gray-700`}>Nom Région</Text>
          <TextInput
            value={nomRegion}
            onChangeText={setNomRegion}
            placeholder="Ex: Analamanga"
            style={tw`p-3 bg-gray-100 border border-gray-300 rounded-md`}
          />
        </View>
      </View>

      <TouchableOpacity onPress={validerEtEnvoyer} style={tw`bg-yellow-500 py-3 rounded-md`}>
        <Text style={tw`text-center text-white font-bold`}>Créer Région</Text>
      </TouchableOpacity>
    </View>
  );
}
