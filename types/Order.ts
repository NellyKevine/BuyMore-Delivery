import { OrderAddress } from "./OrderAddress";
import { OrderClient } from "./OrderClient";
import { OrderItem } from "./OrderItem";
import { OrderLivreur } from "./OrderLivreur";
import { OrderStatus } from "./OrderStatus";


export type Order = {
  /** Identifiant de la commande */
  id: number;

  /** Statut exact backend */
  status: OrderStatus;

  /** Montant total */
  total_amount: number;

  /** Dates */
  created_at: string;
  updated_at: string;

  /** Commentaire éventuel */
  comment: string | null;

  /** Adresse de livraison */
  address: OrderAddress;

  /** Articles de la commande */
  items: OrderItem[];

  /** Livreur assigné */
  livreur: OrderLivreur;

  /** Client final */
  client: OrderClient;
};
