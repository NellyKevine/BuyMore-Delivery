/*
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import type {Delivery} from "../types/Delivery";


export function DeliveryCard({ delivery }: { delivery: Delivery }) {
  const router = useRouter();

  const onPress = () => {
    router.push(`/delivery-detail/${delivery.id}`);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box className="bg-white p-5 rounded-xl shadow-lg my-3 mx-4 border border-gray-200">
        <HStack className="justify-between items-start">
          <VStack className="flex-1">
            <Text className="text-lg font-bold text-gray-900">
              Commande #{delivery.order_number}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">Client : {delivery.client_name}</Text>
            <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
              {delivery.delivery_address}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">Distance : {delivery.distance}</Text>
          </VStack>

          <Text className="text-2xl font-bold text-green-600">
            {delivery.amount.toFixed(2)} €
          </Text>
        </HStack>

        <HStack className="justify-between items-center mt-4">
          <Badge
            className={
               "available"
                ? "bg-blue-500"
                :  "assigned"
                ? "bg-orange-500"
                : "bg-green-500"
            }
          >
            <Text className="text-white font-medium">
              {delivery.status === "available" ? "Disponible" : 
               delivery.status === "assigned" ? "Assignée" : "En cours"}
            </Text>
          </Badge>

          {delivery.status === "available" && (
            <Button className="bg-green-600 px-6 py-2 rounded-lg">
              <Text className="text-white font-semibold">Accepter</Text>
            </Button>
          )}
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}*/