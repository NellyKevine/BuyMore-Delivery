// components/data/fakeData.ts
import type { Delivery } from "@/components/types/Delivery";



// Toutes les livraisons (pour la liste) + détails intégrés
export const fakeDeliveries: Delivery[] = [
  {
    id: "1",
    order_number: "CMD-7845",
    client_name: "Sophie Martin",
    delivery_address: "15 rue des Lilas, 75015 Paris",
    distance: "2.4 km",
    amount: 38.50,
    status: "available",
    items: ["2 Burgers classiques", "1 Frites moyennes", "1 Coca Zero", "1 Salade César"],
    phone: "06 45 78 91 23",
    notes: "Laisser au gardien si pas de réponse",
  },
  {
    id: "2",
    order_number: "CMD-7846",
    client_name: "Ahmed Benali",
    delivery_address: "Batiment B, 42 avenue de la République, 93100 Montreuil",
    distance: "4.1 km",
    amount: 52.00,
    status: "available",
    items: ["1 Pizza Margherita", "1 Tiramisu", "1 Eau pétillante"],
    phone: "07 89 12 34 56",
    notes: "Code digicode : A2369*",
  },
  {
    id: "3",
    order_number: "CMD-7847",
    client_name: "Claire Dubois",
    delivery_address: "8 boulevard Voltaire, 75011 Paris",
    distance: "1.8 km",
    amount: 29.90,
    status: "in_progress",
    items: ["1 Pad Thaï poulet", "1 Spring rolls", "1 Thé glacé"],
    phone: "06 11 22 33 44",
  },
  {
    id: "4",
    order_number: "CMD-7848",
    client_name: "Lucas Moreau",
    delivery_address: "Résidence les Jardins, 12 rue de Crimée, 75019 Paris",
    distance: "6.3 km",
    amount: 71.20,
    status: "assigned",
    items: ["3 Kebabs complets", "2 Portions frites", "3 Canettes"],
    phone: "06 55 66 77 88",
    notes: "Client paie en espèces, rendre la monnaie sur 80€",
  },
];

// Fonction helper pour récupérer une livraison par ID (avec détails)
export const getDeliveryById = (id: string): Delivery | undefined => {
  return fakeDeliveries.find(d => d.id === id);
};