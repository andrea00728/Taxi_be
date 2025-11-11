// LigneForm.tsx
import { 
  createLigne, 
  getProvinces, 
  getRegions,
} from "@/src/services/api";
import { District, LigneDto, Province, Region } from "@/src/type/ligneType";
import React, { useEffect, useState } from "react";
import { 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  ScrollView 
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "twrnc";

interface SelectOption {
  label: string;
  value: number;
}

export default function LigneForm({ onCreated }: { onCreated: () => void }) {
  // États pour les données brutes
  const [provincesData, setProvincesData] = useState<Province[]>([]);
  const [regionsData, setRegionsData] = useState<Region[]>([]);
  const [districtsData, setDistrictsData] = useState<District[]>([]);

  // États pour les sélections
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  // États pour les options filtrées
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [regions, setRegions] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);

  // États du formulaire
  const [nomLigne, setNomLigne] = useState("");
  const [tarif, setTarif] = useState("");
  const [depart, setDepart] = useState("");
  const [terminus, setTerminus] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Utilisation des services API
        const [provincesRes, regionsRes] = await Promise.all([
          getProvinces(),
          getRegions()
        ]);

        console.log("Provinces reçues:", JSON.stringify(provincesRes, null, 2));
        console.log("Régions reçues:", JSON.stringify(regionsRes, null, 2));

        setProvincesData(provincesRes);
        setRegionsData(regionsRes);

        // Mapper les provinces pour le dropdown
        setProvinces(provincesRes.map((p: Province) => ({ 
          label: p.nom, 
          value: p.id 
        })));

        // Extraire tous les districts des régions
        const allDistricts: District[] = [];
        regionsRes.forEach((region: Region) => {
          if (region.districts && Array.isArray(region.districts)) {
            region.districts.forEach((district: District) => {
              allDistricts.push({
                ...district,
                region_id: region.id
              });
            });
          }
        });
        
        console.log("Districts extraits:", JSON.stringify(allDistricts, null, 2));
        setDistrictsData(allDistricts);

      } catch (error: any) {
        console.error("Erreur chargement:", error);
        Alert.alert("Erreur", "Impossible de charger les données");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les régions quand une province est sélectionnée
  useEffect(() => {
    if (selectedProvince) {
      console.log("Province sélectionnée:", selectedProvince);
      
      const selectedProv = provincesData.find(p => p.id === selectedProvince);
      if (selectedProv?.regions && Array.isArray(selectedProv.regions)) {
        const filteredRegions = selectedProv.regions.map((r: Region) => ({ 
          label: r.nom, 
          value: r.id 
        }));
        console.log("Régions filtrées (depuis province):", filteredRegions);
        setRegions(filteredRegions);
      } else {
        const allRegions = regionsData.map((r: Region) => ({ 
          label: r.nom, 
          value: r.id 
        }));
        console.log("Toutes les régions:", allRegions);
        setRegions(allRegions);
      }
      
      setSelectedRegion(null);
      setSelectedDistrict(null);
      setDistricts([]);
    } else {
      setRegions([]);
      setDistricts([]);
      setSelectedRegion(null);
      setSelectedDistrict(null);
    }
  }, [selectedProvince, provincesData, regionsData]);

  // Filtrer les districts quand une région est sélectionnée
  useEffect(() => {
    if (selectedRegion) {
      console.log("Région sélectionnée:", selectedRegion);
      
      const selectedReg = regionsData.find(r => r.id === selectedRegion);
      
      if (selectedReg?.districts && Array.isArray(selectedReg.districts)) {
        const filteredDistricts = selectedReg.districts.map((d: District) => ({ 
          label: d.nom, 
          value: d.id 
        }));
        console.log("Districts filtrés:", filteredDistricts);
        setDistricts(filteredDistricts);
      } else {
        console.log("Aucun district trouvé pour cette région");
        setDistricts([]);
      }
      
      setSelectedDistrict(null);
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
    }
  }, [selectedRegion, regionsData]);

  const validerEtEnvoyer = async () => {
    if (!selectedDistrict || !nomLigne.trim() || !tarif.trim() || !depart.trim() || !terminus.trim()) {
      return Alert.alert("Validation", "Tous les champs doivent être remplis");
    }

    if (isNaN(Number(tarif)) || Number(tarif) <= 0) {
      return Alert.alert("Validation", "Le tarif doit être un nombre positif");
    }

    const data: LigneDto = {
      nom: nomLigne,
      tarif: tarif,
      depart: depart,
      terminus: terminus,
      district_id: selectedDistrict
    };

    try {
      setLoading(true);
      await createLigne(data);

      Alert.alert("✓ Succès", "Ligne créée avec succès !");
      
      // Réinitialisation du formulaire
      setNomLigne("");
      setTarif("");
      setDepart("");
      setTerminus("");
      setSelectedProvince(null);
      setSelectedRegion(null);
      setSelectedDistrict(null);
      
      onCreated();
    } catch (error: any) {
      console.error("Erreur création ligne:", error);
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Erreur lors de la création de la ligne"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={tw`flex-1 justify-center items-center py-10`}>
        <ActivityIndicator size="large" color="#EAB308" />
        <Text style={tw`mt-3 text-gray-600`}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
      <View style={tw`bg-white rounded-xl shadow-sm p-6`}>
        {/* En-tête */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>
            Nouvelle Ligne
          </Text>
          <Text style={tw`text-sm text-gray-500`}>
            Remplissez les informations de la ligne de transport
          </Text>
        </View>

        {/* Debug Info - RETIRER EN PRODUCTION */}
        {__DEV__ && (
          <View style={tw`mb-4 p-3 bg-blue-50 rounded-lg`}>
            <Text style={tw`text-xs text-blue-800`}>
              Debug: {provinces.length} provinces, {regions.length} régions, {districts.length} districts
            </Text>
          </View>
        )}

        {/* Section Localisation */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-base font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2`}>
            📍 Localisation
          </Text>

          {/* Province */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
              Province <Text style={tw`text-red-500`}>*</Text>
            </Text>
            <Dropdown
              data={provinces}
              labelField="label"
              valueField="value"
              placeholder="Sélectionner une province"
              search
              searchPlaceholder="Rechercher..."
              value={selectedProvince}
              onChange={(item) => {
                console.log("Changement province:", item);
                setSelectedProvince(item.value);
              }}
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
              Région <Text style={tw`text-red-500`}>*</Text>
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
              onChange={(item) => {
                console.log("Changement région:", item);
                setSelectedRegion(item.value);
              }}
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
              District <Text style={tw`text-red-500`}>*</Text>
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
              onChange={(item) => {
                console.log("Changement district:", item);
                setSelectedDistrict(item.value);
              }}
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

        {/* Section Informations de la ligne */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-base font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2`}>
            🚌 Informations de la ligne
          </Text>

          <View style={tw`flex-row mb-4`}>
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Nom Ligne <Text style={tw`text-red-500`}>*</Text>
              </Text>
              <TextInput
                value={nomLigne}
                onChangeText={setNomLigne}
                placeholder="Ex: Ligne 101"
                style={tw`px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900`}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Tarif (Ar) <Text style={tw`text-red-500`}>*</Text>
              </Text>
              <TextInput
                value={tarif}
                onChangeText={setTarif}
                keyboardType="numeric"
                placeholder="Ex: 600"
                style={tw`px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900`}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
              Point de Départ <Text style={tw`text-red-500`}>*</Text>
            </Text>
            <TextInput
              value={depart}
              onChangeText={setDepart}
              placeholder="Ex: Analakely"
              style={tw`px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900`}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
              Terminus <Text style={tw`text-red-500`}>*</Text>
            </Text>
            <TextInput
              value={terminus}
              onChangeText={setTerminus}
              placeholder="Ex: Ambohijatovo"
              style={tw`px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900`}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Bouton de soumission */}
        <TouchableOpacity
          onPress={validerEtEnvoyer}
          disabled={loading}
          style={tw`py-4 rounded-lg shadow-md ${
            loading ? "bg-yellow-300" : "bg-yellow-500"
          }`}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={tw`flex-row justify-center items-center`}>
              <ActivityIndicator color="white" size="small" />
              <Text style={tw`ml-2 text-white font-bold text-base`}>
                Création en cours...
              </Text>
            </View>
          ) : (
            <Text style={tw`text-center text-white font-bold text-base`}>
              ✓ Créer la Ligne
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
