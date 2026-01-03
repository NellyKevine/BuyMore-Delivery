// app/(tabs)/today-orders.tsx
import { useMemo, useState } from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl } from "react-native";
import { OrderCard } from "@/components/order/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TodayOrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, error, refetch } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  // Filtrer uniquement les commandes d'aujourd'hui
  const todayOrders = useMemo(() => {
    if (!orders) return [];
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= todayStart;
    });
  }, [orders]);

  // Compter les commandes en attente (in_transit)
  const pendingCount = useMemo(() => {
    return todayOrders.filter(order => order.status === 'in_transit').length;
  }, [todayOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      // Silencieux
    } finally {
      setRefreshing(false);
    }
  };

  const goBack = () => {
    router.push("/(tabs)");
  };

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#155FDC" />
        <Text className="mt-4 text-gray-600">Chargement des commandes...</Text>
      </View>
    );
  }

  if (error) {
    const errorMessage = error.message.includes("réseau") || error.message.includes("connexion")
      ? "Problème de connexion"
      : error.message;

    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header propre avec bouton retour */}
        <Box className="px-5 pt-6 pb-4">
          <HStack className="items-center mb-4">
            <TouchableOpacity 
              onPress={goBack}
              className="p-2 -ml-2 active:opacity-70"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            
            <VStack className="flex-1 ml-3">
              <Text className="text-2xl font-bold text-gray-900">
                Commandes du jour
              </Text>
              <Text className="text-gray-500 text-sm">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="wifi-outline" size={64} color="#9ca3af" />
          <Text className="text-2xl font-bold text-gray-900 mt-6 mb-2 text-center">
            {errorMessage.includes("connexion") ? "Pas de connexion" : "Erreur"}
          </Text>
          <Text className="text-gray-500 text-center mb-8 px-8">
            {errorMessage.includes("connexion") 
              ? "Vérifiez votre connexion internet et réessayez."
              : "Impossible de charger les commandes."
            }
          </Text>
          <TouchableOpacity 
            className="bg-blue-600 px-6 py-3.5 rounded-lg flex-row items-center active:opacity-80"
            onPress={() => refetch()}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header propre avec bouton retour */}
      <Box className="px-5 pt-6 pb-4">
        <HStack className="items-center mb-4">
          <TouchableOpacity 
            onPress={goBack}
            className="p-2 -ml-2 active:opacity-70"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          
          <VStack className="flex-1 ml-3">
            <Text className="text-2xl font-bold text-gray-900">
              Commandes du jour
            </Text>
            <Text className="text-gray-500 text-sm">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Indicateur simple - aligné avec le contenu */}
      {pendingCount > 0 && (
        <Box className="px-5 mb-3">
          <TouchableOpacity 
            className="bg-blue-50 px-4 py-3 rounded-lg flex-row items-center active:opacity-80"
            activeOpacity={0.8}
          >
            <Ionicons name="time" size={20} color="#155FDC" />
            <Text className="text-blue-700 font-medium ml-2 flex-1">
              {pendingCount} commande{pendingCount > 1 ? 's' : ''} à traiter
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </Box>
      )}

      {/* Liste des commandes */}
      {todayOrders.length > 0 ? (
        <View className="flex-1">
          <FlatList
            data={todayOrders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OrderCard order={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingVertical: 12,
              paddingHorizontal: 0,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#155FDC']}
                tintColor="#155FDC"
              />
            }
            ListFooterComponent={<View className="h-4" />}
          />
        </View>
      ) : (
        // État vide - sans le header en double
        <View className="flex-1 justify-center items-center p-8">
          <View className="bg-gray-100 p-7 rounded-2xl mb-6">
            <Ionicons name="calendar-outline" size={70} color="#9ca3af" />
          </View>
          
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Aucune commande aujourd'hui
          </Text>
          
          <Text className="text-gray-500 text-center mb-8 px-8">
            Vous n'avez pas de commandes à livrer pour aujourd'hui.
            Attendez de nouvelles affectations ou rechargez la page.
          </Text>
          
          <TouchableOpacity 
            className="bg-blue-600 px-6 py-3.5 rounded-lg flex-row items-center active:opacity-80"
            onPress={() => refetch()}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Recharger</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}