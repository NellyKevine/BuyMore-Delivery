// app/order-detail/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Badge } from "@/components/ui/badge";
import { 
  ScrollView, 
  Linking, 
  View, 
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "@/hooks/useOrders";
import { useState, useEffect } from "react";
import type { Order } from "@/types/Order";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import axios from "axios";
import { STATUS_LABEL, STATUS_COLOR } from "@/components/ui/orderStatus";
import { useUser } from "@/components/user/MyUserProvider";

const API_BASE_URL = "https://tp4buymore-production.up.railway.app";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: orders, refetch, isLoading: isLoadingOrders } = useOrders();
  const order = orders?.find((o) => o.id.toString() === id) as Order;
  const router = useRouter();
  const { token } = useUser();

  // États
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Récupérer la position actuelle du livreur
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
    } catch (error) {
      console.error('Erreur de localisation:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  if (isLoadingOrders) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#155FDC" />
        <Text className="mt-4 text-gray-600">Chargement des détails...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Ionicons name="document-outline" size={64} color="#9ca3af" />
        <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
          Commande introuvable
        </Text>
        <Text className="text-gray-500 text-center mb-8 px-8">
          Cette commande n'existe pas ou a été supprimée.
        </Text>
        <TouchableOpacity 
          className="bg-blue-600 px-6 py-3.5 rounded-lg"
          onPress={() => router.push("/(tabs)")}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Retour aux commandes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const comeBack = () => router.push("/(tabs)");

  // === Ouvrir Google Maps pour l'itinéraire ===
  const openMaps = () => {
    // Naviguer vers la page de carte avec les données de la commande
    router.push({
      pathname: "/map",
      params: {
        orderId: order.id.toString(),
        clientLat: order.address.lat.toString(),
        clientLon: order.address.lon.toString(),
        clientName: `${order.client.first_name} ${order.client.last_name}`,
        clientAddress: `${order.address.street}, ${order.address.city}`,
      }
    });
  };

  // === Mise à jour du statut de la commande ===
  const updateStatus = async (newStatus: Order['status']) => {
    try {
      setIsUpdatingStatus(true);
      
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/orders/${order.id}/status`,
        { status: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Succès', `Statut mis à jour: ${STATUS_LABEL[newStatus]}`);
        refetch();
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      Alert.alert(
        'Erreur', 
        error.response?.data?.message || 'Impossible de mettre à jour le statut'
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // === Obtenir le prochain statut selon le workflow simplifié ===
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'in_transit': // assignée
        return 'delivered'; // directement livrée
      default:
        return null;
    }
  };

  // === Obtenir le label du bouton suivant ===
  const getNextActionLabel = (currentStatus: Order['status']): string => {
    switch (currentStatus) {
      case 'in_transit':
        return 'Marquer comme livrée';
      default:
        return 'Action terminée';
    }
  };

  // === Appeler le client ===
  const callClient = () => {
    if (order.client.phone) {
      Linking.openURL(`tel:${order.client.phone}`);
    }
  };

  // === Rendu des boutons d'action selon le statut ===
  const renderStatusActions = () => {
    const nextStatus = getNextStatus(order.status);
    const canUpdate = !isUpdatingStatus && nextStatus !== null;

    return (
      <VStack space="md" className="w-full">
        {/* Bouton d'action principal - seulement pour in_transit */}
        {order.status === 'in_transit' && (
          <TouchableOpacity
            className={`${isUpdatingStatus ? 'bg-gray-400' : 'bg-green-600'} py-4 rounded-xl shadow-lg`}
            onPress={() => updateStatus('delivered')}
            disabled={!canUpdate || isUpdatingStatus}
            activeOpacity={0.8}
          >
            {isUpdatingStatus ? (
              <HStack className="items-center justify-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-bold text-lg ml-3">
                  Traitement...
                </Text>
              </HStack>
            ) : (
              <HStack className="items-center justify-center">
                <Ionicons name="checkmark-circle" size={22} color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  Marquer comme livrée
                </Text>
              </HStack>
            )}
          </TouchableOpacity>
        )}

        {/* Statut livrée (bouton désactivé) */}
        {order.status === 'delivered' && (
          <TouchableOpacity
            className="bg-green-600 py-4 rounded-xl shadow-lg"
            disabled
          >
            <HStack className="items-center justify-center">
              <Ionicons name="checkmark-done-circle" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Livraison effectuée ✓
              </Text>
            </HStack>
          </TouchableOpacity>
        )}

        {/* Indicateur de progression simplifié */}
        <Box className="bg-gray-50 p-3 rounded-lg">
          <Text className="text-gray-600 text-sm text-center font-medium mb-3">
            État de la livraison
          </Text>
          
          <View className="flex-row items-center justify-center mb-2">
            <View className={`w-12 h-12 rounded-full flex items-center justify-center ${
              order.status === 'in_transit' ? 'bg-blue-600' : 
              order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <Ionicons 
                name={order.status === 'in_transit' ? "cube-outline" : "checkmark-done"} 
                size={24} 
                color="white" 
              />
            </View>
            
            <View className="h-1 w-16 bg-gray-300 mx-4" />
            
            <View className={`w-12 h-12 rounded-full flex items-center justify-center ${
              order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <Ionicons 
                name={order.status === 'delivered' ? "checkmark-done" : "home-outline"} 
                size={24} 
                color="white" 
              />
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className={`text-sm font-medium ${
                order.status === 'in_transit' ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Assignée
              </Text>
              {order.status === 'in_transit' && (
                <Text className="text-xs text-gray-500 mt-1">En attente</Text>
              )}
            </View>
            
            <View className="items-center">
              <Text className={`text-sm font-medium ${
                order.status === 'delivered' ? 'text-green-600' : 'text-gray-500'
              }`}>
                Livrée
              </Text>
              {order.status === 'delivered' && (
                <Text className="text-xs text-gray-500 mt-1">Terminée</Text>
              )}
            </View>
          </View>
          
          <Text className="text-gray-500 text-xs text-center mt-3">
            {order.status === 'in_transit' 
              ? 'Cette commande vous a été assignée. Cliquez sur "Marquer comme livrée" une fois la livraison effectuée.'
              : 'Cette commande a été livrée avec succès.'
            }
          </Text>
        </Box>
      </VStack>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Box className="bg-blue-600 px-5 pt-6 pb-6">
        <HStack className="items-center mb-4">
          <TouchableOpacity 
            onPress={comeBack}
            className="p-2 rounded-full bg-white/20 active:bg-white/30"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-white text-center flex-1 mr-8">
            Détails de la commande
          </Text>
        </HStack>

        <VStack>
          <HStack className="justify-between items-start">
            <VStack className="flex-1">
              <Text className="text-2xl font-extrabold text-white">
                Commande #{order.id}
              </Text>
              <Text className="text-white/90 text-base mt-1">
                {order.client.first_name} {order.client.last_name}
              </Text>
            </VStack>
            
            <Box className="bg-white px-4 py-3 rounded-lg shadow">
              <Text className="text-2xl font-extrabold text-blue-700">
                {order.total_amount.toFixed(0)} FCFA
              </Text>
            </Box>
          </HStack>

          {/* Badge statut */}
          <Box className="mt-5">
            <Badge className={`${STATUS_COLOR[order.status]} px-4 py-2 rounded-full self-start`}>
              <Text className="text-white font-bold">
                {STATUS_LABEL[order.status]}
              </Text>
            </Badge>
          </Box>
        </VStack>
      </Box>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="p-5" space="lg">
          {/* Section Itinéraire */}
          <Box className="bg-white p-4 rounded-2xl shadow border border-gray-100">
            <HStack className="items-center justify-between mb-4">
              <HStack className="items-center">
                <Ionicons name="navigate-circle" size={24} color="#155FDC" />
                <Text className="font-bold text-gray-800 text-lg ml-3">
                  Itinéraire
                </Text>
              </HStack>
              
              {isLoadingLocation && (
                <ActivityIndicator size="small" color="#155FDC" />
              )}
            </HStack>

            <TouchableOpacity
              className={`${!currentLocation && !isLoadingLocation ? 'bg-gray-400' : 'bg-green-600'} py-3 rounded-xl active:opacity-80`}
              onPress={openMaps}
              disabled={!currentLocation && !isLoadingLocation}
              activeOpacity={0.8}
            >
              <HStack className="items-center justify-center">
                <Ionicons name="map" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  {isLoadingLocation ? 'Localisation...' : 'Voir l\'itinéraire '}
                </Text>
              </HStack>
            </TouchableOpacity>

            <Text className="text-gray-600 text-sm mt-3">
              📍 {order.address.street}, {order.address.city}, {order.address.country}
            </Text>
            
          </Box>

          {/* Section Informations client */}
          <Box className="bg-white p-4 rounded-2xl shadow border border-gray-100">
            <HStack className="items-center mb-4">
              <Ionicons name="person-circle" size={24} color="#4b5563" />
              <Text className="font-bold text-gray-800 text-lg ml-3">
                Informations client
              </Text>
            </HStack>
            
            <VStack space="md">
              <VStack>
                <Text className="text-gray-500 text-sm">Nom complet</Text>
                <Text className="text-gray-800 font-medium text-base">
                  {order.client.first_name} {order.client.last_name}
                </Text>
              </VStack>
              
              <VStack>
                <Text className="text-gray-500 text-sm">Téléphone</Text>
                <TouchableOpacity onPress={callClient} activeOpacity={0.7}>
                  <HStack className="items-center">
                    <Ionicons name="call" size={16} color="#3b82f6" />
                    <Text className="text-blue-600 font-medium text-base ml-2">
                      {order.client.phone}
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color="#9ca3af" className="ml-1" />
                  </HStack>
                </TouchableOpacity>
              </VStack>
              
              {order.client.email && (
                <VStack>
                  <Text className="text-gray-500 text-sm">Email</Text>
                  <Text className="text-gray-800 font-medium text-base">
                    {order.client.email}
                  </Text>
                </VStack>
              )}
            </VStack>
          </Box>

          {/* Section Détails commande */}
          <Box className="bg-white p-4 rounded-2xl shadow border border-gray-100">
            <HStack className="items-center mb-4">
              <Ionicons name="cube" size={24} color="#4b5563" />
              <Text className="font-bold text-gray-800 text-lg ml-3">
                Détails de la commande
              </Text>
            </HStack>
            
            <VStack space="md">
              {order.items.map((item) => (
                <HStack 
                  key={item.id} 
                  className="justify-between items-start py-3 border-b border-gray-100 last:border-b-0"
                >
                  <VStack className="flex-1">
                    <Text className="text-gray-800 font-medium text-base">
                      {item.product.name}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {item.quantity} × {item.unit_price.toFixed(0)} FCFA
                    </Text>
                  </VStack>
                  
                  <Text className="text-gray-900 font-bold text-lg">
                    {item.total_price.toFixed(0)} FCFA
                  </Text>
                </HStack>
              ))}
              
              <Divider className="my-1" />
              
              <HStack className="justify-between items-center pt-2">
                <Text className="text-gray-900 font-bold text-lg">Total</Text>
                <Text className="text-gray-900 font-bold text-xl">
                  {order.total_amount.toFixed(0)} FCFA
                </Text>
              </HStack>
            </VStack>
          </Box>

          

          {/* Commentaire */}
          {order.comment && (
            <Box className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <HStack className="items-center mb-3">
                <Ionicons name="information-circle" size={20} color="#b45309" />
                <Text className="font-bold text-amber-800 ml-2">
                  Note importante
                </Text>
              </HStack>
              <Text className="text-amber-900">{order.comment}</Text>
            </Box>
          )}

          {/* Section Actions */}
          <Box className="bg-white p-4 rounded-2xl shadow-lg mt-2 mb-8">
            <Text className="font-bold text-gray-800 text-lg mb-4 text-center">
              {order.status === 'in_transit' ? 'Valider la livraison' : 'Statut de la commande'}
            </Text>
            {renderStatusActions()}
            
            <Text className="text-gray-500 text-center text-sm mt-4">
              {order.status === 'in_transit' 
                ? 'Une fois à destination, marquez la commande comme livrée'
                : 'Livraison terminée avec succès'
              }
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}