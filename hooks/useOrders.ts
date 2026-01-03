// hooks/useOrders.ts - Version avec meilleure gestion d'erreurs
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { normalizeOrder } from "../utils/normalizeOrder";
import type { Order } from "../types/Order";
import { useUser } from "@/components/user/MyUserProvider";

const API_BASE_URL = "https://tp4buymore-production.up.railway.app";

const fetchOrders = async (token: string): Promise<Order[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/admin/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // Timeout de 10 secondes
      }
    );

    // Log simplifié
    console.log(`Orders fetched: ${response.data.data?.data?.length || 0}`);

    if (response.data.success && response.data.data && Array.isArray(response.data.data.data)) {
      return response.data.data.data.map(normalizeOrder);
    }
    
    return [];
  } catch (error: any) {
    // Gestion améliorée des erreurs
    if (error.code === 'ECONNABORTED') {
      throw new Error("La requête a expiré. Vérifiez votre connexion internet.");
    } else if (!error.response) {
      throw new Error("Erreur réseau. Vérifiez votre connexion internet.");
    } else if (error.response.status === 401) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    } else if (error.response.status === 500) {
      throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
    } else {
      throw new Error("Impossible de charger les commandes.");
    }
  }
};

export const useOrders = () => {
  const { token, isLoggedIn } = useUser();
  
  return useQuery<Order[], Error>({
    queryKey: ["orders", token],
    queryFn: () => fetchOrders(token!),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
    retry: 2, // Seulement 2 tentatives
    retryDelay: 1000, // 1 seconde entre les tentatives
    enabled: !!token && isLoggedIn,
    // Empêche l'affichage d'erreur pendant le rechargement
    refetchOnWindowFocus: false,
    // Ne pas recharger automatiquement en cas d'erreur
    refetchOnReconnect: false,
  });
};