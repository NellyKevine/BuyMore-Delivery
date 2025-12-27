import { useLg } from '@/components/langue/MyLanguageProvider';
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import de l'icône locale pour la preuve
import proofIcon from '../../assets/images/icon.png'; // Ajuste le chemin si nécessaire

export default function Deliveries() {
  const { t } = useLg();

  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const today = getTodayDate();

  const fakeDeliveries = [
    // Aujourd’hui
    {
      id: 1,
      order_number: "CMD-2025-1201",
      client_name: "Sophie Martin",
      address: "12 rue des Fleurs, 69002 Lyon",
      phone: "06 12 34 56 78",
      status: "en_attente",
      amount: 89.90,
      delivery_date: today,
    },
    {
      id: 2,
      order_number: "CMD-2025-1202",
      client_name: "Ahmed Benali",
      address: "45 avenue de la République, 75011 Paris",
      phone: "06 98 76 54 32",
      status: "en_route",
      amount: 156.00,
      delivery_date: today,
    },
    {
      id: 3,
      order_number: "CMD-2025-1203",
      client_name: "Emma Laurent",
      address: "5 place Bellecour, 69002 Lyon",
      phone: "06 55 44 33 22",
      status: "en_cours",
      amount: 67.30,
      delivery_date: today,
    },

    // Historique
    {
      id: 4,
      order_number: "CMD-2025-1199",
      client_name: "Julie Dubois",
      address: "8 boulevard Saint-Germain, 75005 Paris",
      status: "livrée",
      amount: 45.50,
      delivery_date: "2025-12-17",
      proof_type: "photo",
      proof_source: proofIcon,
    },
    {
      id: 5,
      order_number: "CMD-2025-1195",
      client_name: "Marie Dupont",
      address: "10 avenue des Champs, 75008 Paris",
      status: "échec",
      amount: 99.90,
      delivery_date: "2025-12-16",
      proof_type: "photo",
      proof_source: proofIcon,
      failure_reason: "Client absent",
    },
    {
      id: 6,
      order_number: "CMD-2025-1190",
      client_name: "Lucas Moreau",
      address: "23 rue de Rivoli, 75001 Paris",
      status: "livrée",
      amount: 120.00,
      delivery_date: "2025-12-15",
      proof_type: "signature",
      proof_source: proofIcon,
    },
  ];

  useEffect(() => {
    setDeliveries(fakeDeliveries);
    setLoading(false);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const safeLowerCase = (str: any): string => (typeof str === "string" ? str.toLowerCase() : "");

  // Filtrage par onglet
  const tabData = fakeDeliveries.filter((item) =>
    activeTab === "today" ? item.delivery_date === today : item.delivery_date < today
  );

  // Filtrage par recherche
  const filteredData = tabData.filter((item) =>
    item.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayCount = fakeDeliveries.filter((d) => d.delivery_date === today).length;
  const historyCount = fakeDeliveries.filter((d) => d.delivery_date < today).length;

  const getStatusColor = (status: string | undefined) => {
    const lower = safeLowerCase(status);
    if (lower.includes("en_route") || lower.includes("en_cours")) return "bg-orange-500";
    if (lower.includes("en_attente")) return "bg-blue-500";
    if (lower.includes("livrée")) return "bg-green-500";
    if (lower.includes("échec")) return "bg-red-500";
    return "bg-gray-400";
  };

  const getStatusText = (status: string | undefined) => {
    const lower = safeLowerCase(status);
    const keyMap: Record<string, string> = {
      en_attente: "status_en_attente",
      en_route: "status_en_route",
      en_cours: "status_en_cours",
      livrée: "status_livree",
      échec: "status_echec",
    };
    return t(keyMap[lower] || "status_inconnu");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#155FDC" />
          <Text className="mt-4 text-lg text-gray-600">{t('loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <Text className="text-3xl font-bold text-[#155FDC] px-5 pt-5 pb-3">
          {t('del_deliveries')}
        </Text>

        {/* Onglets */}
        <View className="flex-row bg-white mx-4 mb-4 rounded-xl overflow-hidden shadow-lg">
          <TouchableOpacity
            className={`flex-1 py-4 items-center ${activeTab === "today" ? "bg-[#155FDC]" : "bg-gray-200"}`}
            onPress={() => setActiveTab("today")}
          >
            <Text className={`text-lg font-bold ${activeTab === "today" ? "text-white" : "text-gray-700"}`}>
              {t('today')} ({todayCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-4 items-center ${activeTab === "history" ? "bg-[#155FDC]" : "bg-gray-200"}`}
            onPress={() => setActiveTab("history")}
          >
            <Text className={`text-lg font-bold ${activeTab === "history" ? "text-white" : "text-gray-700"}`}>
              {t('history')} ({historyCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View className="mx-4 mb-4">
          <TextInput
            placeholder={t('search_placeholder') || "Rechercher par commande, client ou adresse..."}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-white px-4 py-3 rounded-xl shadow-md text-base"
            clearButtonMode="while-editing"
          />
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View className="bg-white mx-4 mb-4 p-6 rounded-2xl shadow-lg">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">
                  {t('order_number')}{item.order_number}
                </Text>
                <View className={`px-5 py-2 rounded-full ${getStatusColor(item.status)}`}>
                  <Text className="text-white text-sm font-bold uppercase">
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>

              <Text className="text-lg font-semibold text-gray-900 mb-1">{item.client_name}</Text>
              <Text className="text-base text-gray-700 mb-2">{item.address}</Text>
              {item.phone && <Text className="text-base text-gray-600 mb-4">Tél: {item.phone}</Text>}

              {/* Preuve avec icon.png */}
              {(item.status === "livrée" || item.status === "échec") && item.proof_source && (
                <View className="mt-5">
                  <Image
                    source={item.proof_source}
                    className="w-full h-80 rounded-xl"
                    resizeMode="contain"
                  />
                  <Text className="text-center text-gray-500 text-sm mt-2">
                    {item.failure_reason || t('proof_of_delivery')}
                  </Text>
                </View>
              )}

              <Text className="text-xl font-bold text-[#155FDC] mt-5">
                {t('amount')} {item.amount.toFixed(2)} €
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-40">
              <Text className="text-xl font-semibold text-gray-500">
                {searchQuery ? "Aucun résultat trouvé" : (activeTab === "today" ? t('no_deliveries_today') : t('no_history'))}
              </Text>
              <Text className="text-base text-gray-400 mt-2">{t('pull_to_refresh')}</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
