// components/order/OrderCard.tsx - Version avec bouton couleur statut
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Linking } from "react-native";
import type { Order } from "../../types/Order";
import { STATUS_COLOR, STATUS_LABEL } from "../ui/orderStatus";
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export function OrderCard({ order }: { order: Order }) {
  const router = useRouter();

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

  const actions = {
    details: () => router.push({ pathname: "/order-detail/[id]", params: { id: order.id } })
  };

  // Icône et couleur selon statut
  const getStatusConfig = (status: string) => {
    switch (status) {      
      case 'in_transit': 
        return { 
          icon: 'cube', 
          color: '#3b82f6', 
          bg: 'bg-blue-100',
          buttonColor: 'bg-blue-500',
          buttonHover: 'active:bg-blue-600'
        };
      case 'delivered': 
        return { 
          icon: 'checkmark-circle', 
          color: '#16a34a', 
          bg: 'bg-green-100',
          buttonColor: 'bg-green-500',
          buttonHover: 'active:bg-green-600'
        };
      default: 
        return { 
          icon: 'document', 
          color: '#6b7280', 
          bg: 'bg-gray-100',
          buttonColor: 'bg-gray-500',
          buttonHover: 'active:bg-gray-600'
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <TouchableOpacity 
      className="bg-white mx-4 my-2 rounded-xl overflow-hidden shadow-sm border border-gray-100 active:opacity-95"
      onPress={actions.details}
      activeOpacity={0.9}
    >
      {/* Bande de couleur selon statut */}
      <HStack className={`${statusConfig.bg} px-4 py-3`}>
        <HStack className="items-center flex-1">
          <Ionicons name={statusConfig.icon as any} size={20} color={statusConfig.color} style={{ marginRight: 12 }} />
          <VStack className="flex-1">
            <Text className="text-gray-900 font-bold text-lg">Commande #{order.id}</Text>
            <Badge className={`${STATUS_COLOR[order.status]} px-3 py-1 mt-1 self-start`}>
              <Text className="text-white font-medium text-xs">{STATUS_LABEL[order.status]}</Text>
            </Badge>
          </VStack>
        </HStack>
        <Text className="text-xl font-bold text-gray-900">{order.total_amount.toFixed(0)} FCFA</Text>
      </HStack>

      {/* Contenu */}
      <VStack className="p-4">
        {/* Client */}
        <HStack className="items-center mb-3">
          <Ionicons name="person" size={16} color="#4b5563" style={{ marginRight: 12 }} />
          <VStack className="flex-1">
            <Text className="text-gray-800 font-medium" numberOfLines={1}>
              {order.client.first_name} {order.client.last_name}
            </Text>
            <Text className="text-gray-500 text-sm mt-0.5">{order.client.phone}</Text>
          </VStack>
        </HStack>

        {/* Adresse */}
        <HStack className="items-start mb-4">
          <Ionicons name="location" size={16} color="#4b5563" style={{ marginRight: 12, marginTop: 2 }} />
          <VStack className="flex-1">
            <Text className="text-gray-700" numberOfLines={2}>
              {order.address.street}
            </Text>
            <Text className="text-gray-500 text-sm mt-0.5">{order.address.city}</Text>
          </VStack>
        </HStack>

        {/* Bouton Itinéraire - Couleur selon statut */}
        <TouchableOpacity
          className={`${statusConfig.buttonColor} ${statusConfig.buttonHover} w-full py-3 rounded-lg items-center justify-center flex-row`}
          onPress={(e) => {
            e.stopPropagation(); // Empêche le clic de déclencher la navigation vers les détails
            openMaps();
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate" size={18} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-medium">Itinéraire</Text>
        </TouchableOpacity>
      </VStack>
    </TouchableOpacity>
  );
}