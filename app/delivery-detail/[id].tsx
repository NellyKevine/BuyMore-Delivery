// app/delivery-detail/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { ScrollView, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fakeDeliveries } from "@/components/data/fakeDeliveries";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from "expo-camera";
import { useUser } from "@/components/user/MyUserProvider";

export default function DeliveryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const delivery = fakeDeliveries.find((d) => d.id === id) || fakeDeliveries[0];
  const insets = useSafeAreaInsets();
  const [photo, setPhoto] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = permission?.granted;
  
  const router = useRouter();
  const { isLoggedIn } = useUser();

  const comeBack = () => {
    router.back();
  };

  // === PHOTO : fonctionne maintenant (correction du bug de variable) ===
  const handlePhoto = async () => {
    
        // Lancer le sélecteur d'images
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          aspect: [1, 1],
          quality: 1,
          allowsMultipleSelection: false, // true pour sélection multiple
          
        });
    
        console.log(result);
    
        if (!result.canceled && result.assets.length > 0) {
          setPhoto(result.assets[0].uri);
        }
      };
  // === SIGNATURE : placeholder (tu implémenteras plus tard) ===
  const handleSignature = () => {
    alert("Fonction Signature : à implémenter plus tard");
  };

  // === QR CODE : demande permission puis ouvre ton scanner ===
  const handleQRCode = async () => {
    if (!isPermissionGranted) {
      const { granted } = await requestPermission();
      if (!granted) {
        alert("Permission caméra refusée pour scanner le QR code");
        return;
      }
    }
    router.push("/(tabs)/scanCode");
  };

  // === LIVRAISON EFFECTUÉE ===
  const handleDelivered = () => {
    alert("Livraison marquée comme effectuée (à connecter au backend plus tard)");
  };

  // === PROBLÈME DE LIVRAISON ===
  const handleProblem = () => {
    alert("Problème signalé (à connecter au backend plus tard)");
  };

  // === ACCEPTER LA LIVRAISON (maintenant fonctionnel) ===
  const handleAccept = () => {
    alert("Livraison acceptée ! Statut → Assignée (à connecter au backend plus tard)");
    // Plus tard : appel API + mise à jour statut
  };

  // === COMMENCER LA LIVRAISON (maintenant fonctionnel) ===
  const handleStart = () => {
    alert("Livraison commencée ! Statut → En cours (à connecter au backend plus tard)");
    // Plus tard : appel API + mise à jour statut
  };

  const getStatusBadge = () => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      available: { color: "bg-blue-600", label: "Disponible" },
      assigned: { color: "bg-orange-600", label: "Assignée" },
      in_progress: { color: "bg-green-600", label: "En cours" },
    };

    const config = statusConfig[delivery.status] || { color: "bg-gray-600", label: "Inconnu" };

    return (
      <Badge className={`${config.color} px-5 py-2 rounded-full`}>
        <Text className="text-white font-bold text-base">{config.label}</Text>
      </Badge>
    );
  };

  const openMaps = () => {
    router.push("/(tabs)/map");
  };

  const callClient = () => {
    Linking.openURL(`tel:${delivery.phone}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-emerald-700" edges={['top', "bottom"]}>
      <ScrollView className="flex-1 bg-emerald-700">
        <VStack className="bg-white shadow-2xl">
          <Box className="bg-white">
            <Box className="bg-emerald-700 p-6 relative">
              <HStack className="justify-between items-start">
                <VStack className="flex-1 pr-28">
                  <Text className="text-2xl font-extrabold text-white">
                    Commande #{delivery.order_number}
                  </Text>
                  <Text className="text-lg text-white mt-2 opacity-95">
                    {delivery.client_name}
                  </Text>
                  <Box className="mt-4">{getStatusBadge()}</Box>
                </VStack>

                <VStack className="mr-10 mb-3 bg-emerald-700 items-end">
                  <Pressable onPress={comeBack} className="ml-1">
                    <FontAwesome5 name="chevron-right" size={24} color="white" />
                  </Pressable>
                </VStack>

                <Box className="absolute top-12 right-6 bg-white px-6 py-4">
                  <Text className="text-3xl font-extrabold text-primary-700">
                    {delivery.amount.toFixed(0)} €
                  </Text>
                </Box>
              </HStack>
            </Box>

            <Box className="p-6 py-1">
              <VStack space="lg">
                <VStack space="md">
                  <Box>
                    <Text className="font-bold text-gray-700 text-lg mb-2">
                      Adresse de livraison
                    </Text>
                    <Text className="text-gray-900 text-base leading-6">
                      {delivery.delivery_address}
                    </Text>
                  </Box>

                  <HStack className="justify-between items-center">
                    <VStack>
                      <Text className="font-bold text-gray-700">Téléphone client</Text>
                      <Text
                        className="text-blue-600 text-lg font-medium underline mt-1"
                        onPress={callClient}
                      >
                        {delivery.phone}
                      </Text>
                    </VStack>

                    <VStack className="items-end">
                      <Text className="font-bold text-gray-700">Distance</Text>
                      <Text className="text-gray-900 text-xl font-bold mt-1">
                        {delivery.distance}
                      </Text>
                    </VStack>
                  </HStack>

                  {delivery.notes && (
                    <Box className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4">
                      <Text className="font-bold text-amber-800 mb-1">Note importante</Text>
                      <Text className="text-amber-900 italic">{delivery.notes}</Text>
                    </Box>
                  )}
                </VStack>

                <Divider className="my-6" />

                <VStack>
                  <Text className="font-bold text-lg text-gray-800 mb-4">
                    Contenu de la commande
                  </Text>
                  {delivery.items.map((item, index) => (
                    <HStack key={index} className="mb-3 items-start">
                      <Text className="text-gray-600 mr-4 text-lg">•</Text>
                      <Text className="text-gray-800 flex-1 text-base">{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Box>
          </Box>

          {/* Boutons d'action fixes en bas */}
          <Box 
            className="bg-white px-4 mx-4 py-4"
            style={{ paddingBottom: insets.bottom + 20 }} // Visible sur Android
          >
            <VStack space="md">
              {delivery.status === "available" && (
                <Button className="bg-green-600 py-5 rounded-2xl shadow-lg h-13" onPress={handleAccept}>
                  <ButtonText className="text-white font-bold text-xl text-center">
                    Accepter la livraison
                  </ButtonText>
                </Button>
              )}

              {delivery.status === "assigned" && (
                <VStack space="lg" className="flex-1">
                  <Button className="bg-blue-600 py-5 rounded-2xl shadow-lg h-13" onPress={handleStart}>
                    <ButtonText className="text-white font-bold text-xl text-center">
                      Commencer la livraison
                    </ButtonText>
                  </Button>

                  <Button className="bg-gray-700 py-4 rounded-2xl h-13" onPress={openMaps}>
                    <ButtonText className="text-white font-bold text-lg text-center">
                      Ouvrir l'itinéraire dans Maps
                    </ButtonText>
                  </Button>
                </VStack>
              )}

              {delivery.status === "in_progress" && (
                <>
                  <Text className="text-center font-bold text-gray-800 text-lg mb-4">
                    Preuve de livraison requise
                  </Text>

                  <HStack space="md" className="mb-5 items-center justify-center">
                    <Button className=" bg-indigo-600 py-4 rounded-xl h-13" onPress={handlePhoto}>
                      <ButtonText className="text-white font-bold text-base">Photo</ButtonText>
                    </Button>
                    
                  </HStack>

                  

                  <Button className="bg-green-600 py-5 rounded-2xl shadow-lg h-13" onPress={handleDelivered}>
                    <ButtonText className="text-white font-bold text-xl text-center">
                      Livraison effectuée
                    </ButtonText>
                  </Button>

                  <Button className="bg-red-600 py-4 rounded-2xl h-13" onPress={handleProblem}>
                    <ButtonText className="text-white font-bold text-lg text-center">
                      Problème de livraison
                    </ButtonText>
                  </Button>
                </>
              )}
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}