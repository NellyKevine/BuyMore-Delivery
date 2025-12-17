import { useLg } from '@/components/langue/MyLanguageProvider';
import { useTheme } from '@/components/theme/MyThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';
import { useUser } from '../user/MyUserProvider';

export default function TabLayout() {
  const { isDark } = useTheme();
  const { isLoggedIn } = useUser();
  const { t } = useLg();
  const router = useRouter();
  const goToPtofil = () => {
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
          title: 'BuyMore',
          tabBarLabel: t('acc_accueil'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={goToPtofil} style={{ marginRight: 15 }}>
              <Ionicons name="person-circle-outline" size={35} color="#155FDC" />
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
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          //...(!isLoggedIn && { href: null })
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

      

      
      

    </Tabs>
  );
}
