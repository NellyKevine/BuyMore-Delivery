import { useLg } from '@/components/langue/MyLanguageProvider';
import { useTheme } from '@/components/theme/MyThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useUser } from '../user/MyUserProvider';
import { HStack } from '../ui/hstack';
import { DrawerLayout } from '../drawer/DrawerLayout';

export default function StackLayout() {
  const { isDark } = useTheme();
  const { isLoggedIn } = useUser();
  const { t } = useLg();
  const router = useRouter();

  const goToProfil = () => {
    router.push('/settings');
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#021c29ff' : '#fcfdfdff',
        },
        headerTintColor: isDark ? '#fcfdfdff' : '#155FDC',
        headerTitleStyle: {
          color: isDark ? '#fcfdfdff' : '#155FDC',
        },
        ...Platform.select({
          android: {
            navigationBarColor: isDark ? '#ffffff' : '#000000',
          },
        }),
      }}
    >
      {/* ACCUEIL (header visible) */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitle: () => (
            <HStack className="flex-row items-center">
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#155FDC' }}>
                Buy
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: 'white',
                  textShadowColor: '#155FDC',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10,
                }}
              >
                More
              </Text>
            </HStack>
          ),
          headerRight: () => (
            <HStack>
              <TouchableOpacity onPress={goToProfil} style={{ marginRight: 30 }}>
                <Ionicons
                  name="notifications-outline"
                  size={21}
                  color="#155FDC"
                />
              </TouchableOpacity>
              <DrawerLayout />
            </HStack>
          ),
          headerShadowVisible: false
        }}
      />

      {/* LIVRAISONS */}
      <Stack.Screen
        name="deliveries"
        options={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />

      {/* HISTORIQUE */}
      <Stack.Screen
        name="historique"
        options={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />

      {/* MAP */}
      <Stack.Screen
        name="map"
        options={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />

      {/* PROFIL */}
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />

      {/* EDIT PROFIL */}
      <Stack.Screen
        name="editProfil"
        options={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />

      {/* SCAN CODE */}
      <Stack.Screen
        name="scanCode"
        options={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
