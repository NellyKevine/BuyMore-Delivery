// app/(tabs)/index.tsx
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { DeliveryCard } from "@/components/delivery/DeliveryCard";
import { useUser } from "@/components/user/MyUserProvider";
import type { Delivery } from "@/components/types/Delivery";
import { fakeDeliveries } from "@/components/data/fakeDeliveries";


export default function HomeScreen() {
  const { isLoggedIn, isLoading: isAuthLoading } = useUser(); // ← on utilise isLoading du provider !
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulation chargement
  const loadDeliveries = () => {
    setTimeout(() => {
      setDeliveries(fakeDeliveries);
      setLoading(false);
      setRefreshing(false);
    }, 800);
  };

  // Chargement quand l'auth est fini ET l'utilisateur est connecté
  useEffect(() => {
    if (!isAuthLoading && isLoggedIn) {  // ← clé : attendre que l'auth soit fini !
      loadDeliveries();
    }
  }, [isAuthLoading, isLoggedIn]); // ← dépendances importantes

  const onRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  // Si auth charge encore → on montre rien (splash géré par root)
  if (isAuthLoading) {
    return null;
  }

  // Si pas connecté → message ou redirection (mais root gère ça)
  if (!isLoggedIn) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-xl text-gray-600">Veuillez vous connecter</Text>
      </Box>
    );
  }

  // Écran de chargement des livraisons
  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-50">
        <Spinner size="large" className="text-primary-600" />
        <Text className="mt-4 text-lg text-gray-600">
          Chargement des livraisons...
        </Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeliveryCard delivery={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Box className="flex-1 justify-center items-center mt-20 px-8">
            <Text className="text-xl text-gray-500 text-center">
              Aucune livraison disponible pour le moment
            </Text>
            <Text className="text-sm text-gray-500 mt-3 text-center">
              Revenez plus tard ou tirez vers le bas pour rafraîchir 🙂
            </Text>
          </Box>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
}


/*
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { DeliveryCard } from "@/components/delivery/DeliveryCard"; // chemin adapté
import { useUser } from "@/components/user/MyUserProvider";
import axios from "axios";

// Type de livraison (à adapter selon ta réponse API Laravel)
type Delivery = {
  id: string;
  order_number: string;
  client_name: string;
  delivery_address: string;
  distance: string;
  amount: number;
  status: "available" | "assigned" | "in_progress";
};

export default function HomeScreen() {
  const { token, isLoggedIn } = useUser();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fonction pour charger les livraisons
  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(
        "https://ton-api-laravel.com/api/livreur/deliveries/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Adaptez selon la structure réelle de ta réponse API
      setDeliveries(response.data.data || response.data || []);
    } catch (error) {
      console.error("Erreur chargement livraisons :", error);
      // Tu pourras ajouter un toast ici plus tard
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchDeliveries();
    }
  }, [isLoggedIn, token]);

  // Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchDeliveries();
  };

  // Écran de chargement
  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-50">
        <Spinner size="large" className="text-primary-600" />
        <Text className="mt-4 text-lg text-gray-600">
          Chargement des livraisons...
        </Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeliveryCard delivery={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Box className="flex-1 justify-center items-center mt-20 px-8">
            <Text className="text-xl text-gray-500 text-center">
              Aucune livraison disponible pour le moment
            </Text>
            <Text className="text-sm text-gray-500 mt-3 text-center">
              Revenez plus tard ou tirez vers le bas pour rafraîchir 🙂
            </Text>
          </Box>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
}*/

