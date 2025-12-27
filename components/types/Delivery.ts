import { DeliveryStatus } from "./DeliveryStatus";

export type Delivery = {
  id: string;
  order_number: string;
  client_name: string;
  delivery_address: string;
  distance: string;
  amount: number;
  status: DeliveryStatus;
  items: string[];        // Contenu de la commande
  phone: string;          // Téléphone client
  notes?: string;         // Notes spéciales
};
