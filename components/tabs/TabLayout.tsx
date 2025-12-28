import { useLg } from '@/components/langue/MyLanguageProvider';
import { useTheme } from '@/components/theme/MyThemeProvider';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';
import {Text} from "@/components/ui/text";
import { useUser } from '../user/MyUserProvider';
import { HStack } from '../ui/hstack';

export default function TabLayout() {
  const { isDark } = useTheme();
  const { isLoggedIn } = useUser();
  const { t } = useLg();
  const router = useRouter();
  const goToProfil = () => {
    router.push('/profile');
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? '#021c29ff' : '#fcfdfdff',
        },
        tabBarActiveTintColor: isDark ? '#fff' : '#155FDC',
        tabBarInactiveTintColor: isDark ? '#a3a0a0ff' : '#555',
        headerStyle: {
          backgroundColor: isDark ? '#021c29ff' : '#fcfdfdff',
        },
        headerTitleStyle: {
          color: isDark ? '#fcfdfdff' : '#155FDC', // ← Spécifiquement pour le titre

        },
        ...Platform.select({
          android: {
            navigationBarColor: isDark ? '#ffffff' : '#000000', // ← Blanc en dark
          }
        }),
        headerTintColor: isDark ? '#fcfdfdff' : '#155FDC', // Texte et icônes    
      }}
    >
      {/* Accueil */}
      <Tabs.Screen
        name="index"
        options={{
          
          tabBarLabel: t('acc_accueil'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerStyle: {
           elevation: 1, // Supprime l'ombre sous le header
           shadowOpacity: 0,
          },
          headerTitle: () => (
            <HStack className="flex-row items-center ">
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#155FDC' }} >
                Buy
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '800', color: 'white',textShadowColor: '#155FDC',textShadowOffset: { width: 0, height: 0 },textShadowRadius: 10,}}>
               More
              </Text>
            </HStack>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={goToProfil} style={{ marginRight: 15,}} >
              <Ionicons name="notifications-outline" size={24} color="#155FDC" />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="deliveries"
        options={{
          title: t('del_deliveries'),
          tabBarLabel: t('del_deliveries'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />//...(!isLoggedIn && { href: null })
          ),
        }}
      />

      {/* Historique */}
      <Tabs.Screen
        name="historique"
        options={{
          title: t('his_history'),
          tabBarLabel: t('his_history'),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="history" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      

      

      {/* map */}
      <Tabs.Screen
        name="map"
        options={{
          title: t('map_map'),
          tabBarLabel: t('map_map'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      {/* PROFIL, EDITPROFIL, AIDE → MASQUÉS DU TAB */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null, //  masque dans le tab
          headerShown: false,
          tabBarStyle: { display: 'none' }

        }}
      />

      <Tabs.Screen
        name="editProfil"
        options={{
          href: null, // masque dans le tab
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      />

      <Tabs.Screen
        name="scanCode"
        options={{
          href: null, // masque dans le tab
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      />

      

      
      

    </Tabs>
  );
}
