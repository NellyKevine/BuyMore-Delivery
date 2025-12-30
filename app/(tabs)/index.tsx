
import { useLg } from '@/components/langue/MyLanguageProvider';
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { t } = useLg();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        {/* Greeting */}
        <View className="px-6 pt-8">
          <Text className="text-3xl font-bold text-gray-800">
            {t('hello')} {/* "Bonjour," */}
          </Text>
          <Text className="text-3xl font-bold text-[#155FDC] mt-1">
            Amine Dupont
          </Text>
        </View>

        {/* Daily summary */}
        <View className="mx-6 mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            {t('daily_summary')}
          </Text>

          <View className="bg-white rounded-2xl shadow-lg p-6">
            <Text className="text-3xl font-bold text-[#155FDC] text-center mb-6">
              5 livraisons aujourd'hui
            </Text>

            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-4xl font-bold text-orange-500">2</Text>
                <Text className="text-base text-gray-600 mt-1">{t('in_progress')}</Text>
              </View>
              <View className="items-center">
                <Text className="text-4xl font-bold text-green-500">2</Text>
                <Text className="text-base text-gray-600 mt-1">{t('delivered')}</Text>
              </View>
              <View className="items-center">
                <Text className="text-4xl font-bold text-red-500">1</Text>
                <Text className="text-base text-gray-600 mt-1">{t('failed')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick action button */}
        <View className="mx-6 mt-8">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/deliveries')}
            className="bg-[#155FDC] py-5 rounded-2xl shadow-lg"
          >
            <Text className="text-white text-xl font-bold text-center">
              {t('view_deliveries')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mini map placeholder */}
        <View className="mx-6 mt-8 mb-10">
          <View className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-64 items-center justify-center">
            <Text className="text-gray-500 text-lg">
              {t('mini_map_placeholder')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}