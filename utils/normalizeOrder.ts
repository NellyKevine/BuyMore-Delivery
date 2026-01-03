import { Order } from "../types/Order";

export const normalizeOrder = (order: any): Order => {
  try {
    return {
      id: order.id,
      status: order.status,
      total_amount: Number(order.total_amount),
      created_at: order.created_at,
      updated_at: order.updated_at,
      comment: order.comment,
      address: {
        id: order.address.id,
        name: order.address.name,
        country: order.address.country,
        city: order.address.city,
        street: order.address.street,
        lat: Number(order.address.lat),
        lon: Number(order.address.lon),
      },
      items: order.items.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        total_price: Number(item.total_price),
        product: {
          id: item.product.id,
          name: item.product.name,
        },
      })),
      livreur: {
        id: order.livreur.id,
        first_name: order.livreur.first_name,
        last_name: order.livreur.last_name,
        phone: order.livreur.phone,
      },
      client: {
        id: order.cart.user.id,
        name: order.cart.user.name,
        first_name: order.cart.user.first_name,
        last_name: order.cart.user.last_name,
        phone: order.cart.user.phone,
        email: order.cart.user.email,
      },
    };
  } catch (error) {
    console.error("Error normalizing order:", error);
    console.error("Problematic order data:", order);
    
    // Retourne une commande par défaut en cas d'erreur
    return {
      id: order.id || 0,
      status: "in_transit",
      total_amount: 0,
      created_at: "",
      updated_at: "",
      comment: null,
      address: {
        id: 0,
        name: "",
        country: "",
        city: "",
        street: "",
        lat: 0,
        lon: 0,
      },
      items: [],
      livreur: {
        id: 0,
        first_name: "",
        last_name: "",
        phone: "",
      },
      client: {
        id: 0,
        name: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
      },
    };
  }
};