
import { OrderStatus } from "../../types/OrderStatus";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  in_transit: "Assignée",
  delivered: "Livrée",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  in_transit: "bg-blue-600",   // Bleu pour "assignée"
  delivered: "bg-green-600",   // Vert pour "livrée"
};