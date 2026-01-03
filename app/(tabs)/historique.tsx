// app/(tabs)/orders.tsx - Icône cohérente
import { useState, useMemo } from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl } from "react-native";
import { OrderCard } from "@/components/order/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { OrderFilters } from "@/components/order/OrderFilters";
import { Ionicons } from '@expo/vector-icons';
import { FilterType } from "@/types/FilterType"



export default function OrdersScreen() {
  const { data: orders, isLoading, error, refetch } = useOrders();
  const [activeFilter, setActiveFilter] = useState<FilterType>('in_transit');
  const [refreshing, setRefreshing] = useState(false);

  // Calcul des statistiques
  const stats = useMemo(() => {
    if (!orders) return { all: 0, in_transit: 0, delivered: 0 };
    
    return {
      all: orders.length,
      in_transit: orders.filter(o => o.status === 'in_transit').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  }, [orders]);

  // Filtrage des commandes
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    if (activeFilter === 'ALL') return orders;
    
    return orders.filter(order => order.status === activeFilter);
  }, [orders, activeFilter]);

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
      <View className="flex-1 justify-center items-center bg-white p-6">
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
        <View 
          className="bg-blue-600 px-6 py-3.5 rounded-lg flex-row items-center active:opacity-80"
          onTouchEnd={() => refetch()}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Réessayer</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* En-tête principal */}
      <View className="px-5 pt-6 pb-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-gray-900">
              Mes livraisons
            </Text>
            <Text className="text-gray-500 mt-2">
              {stats.in_transit} commande{stats.all !== 1 ? 's' : ''} à traiter
            </Text>
          </View>
          
          {/* Indicateur de statut principal - Cube pour "assignée" */}
          <View className="items-center bg-blue-50 px-4 py-3 rounded-xl">
            <View className="flex-row items-center">
              <Ionicons name="cube" size={20} color="#155FDC" /> 
              <Text className="text-blue-700 font-bold text-2xl ml-2">
                {stats.in_transit}
              </Text>
            </View>
            <Text className="text-blue-600 text-sm font-medium mt-1">Assignées</Text>
          </View>
        </View>
      </View>

      {/* Barre de filtres */}
      <OrderFilters 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={stats}
      />

      
      {filteredOrders.length > 0 ? (
        <View className="flex-1">
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OrderCard order={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 12 }}
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
        // État vide
        <View className="flex-1 justify-center items-center p-8">
          <View className="bg-gray-100 p-7 rounded-2xl mb-6">
            <Ionicons 
              name={activeFilter === 'ALL' ? "cube-outline" : "funnel-outline"} 
              size={70} 
              color="#9ca3af" 
            />
          </View>
          
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            {activeFilter === 'ALL' 
              ? "Aucune commande disponible"
              : "Aucune commande correspondante"
            }
          </Text>
          
          <Text className="text-gray-500 text-center mb-8 px-8">
            {activeFilter === 'ALL'
              ? "Vous n'avez pas de commandes à livrer pour le moment."
              : `Vous n'avez pas de commandes avec le statut "${activeFilter}".`
            }
          </Text>
          
          {activeFilter !== 'ALL' && (
            <View 
              className="bg-blue-600 px-6 py-3.5 rounded-lg flex-row items-center active:opacity-80"
              onTouchEnd={() => setActiveFilter('ALL')}
            >
              <Ionicons name="apps" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">Voir toutes les commandes</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}