import { useLg } from '@/components/langue/MyLanguageProvider'; 
import { useTheme } from '@/components/theme/MyThemeProvider'; 
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { Tabs, useRouter } from 'expo-router'; 
import { Platform, TouchableOpacity, View } from 'react-native'; 
import {Text} from "@/components/ui/text"; 
import { useUser } from '@/components/user/MyUserProvider';
import { HStack } from '@/components/ui/hstack'; 
import { FabDrawer } from '@/components/drawer/FabDrawer'; 
import { DrawerLayout } from '@/components/drawer/DrawerLayout'; 
 
 export default function TabLayout() { 
  const { isDark } = useTheme(); 
  const { isLoggedIn } = useUser(); 
  const { t } = useLg(); 
  const router = useRouter(); 
  const goToProfil = () => { router.push('/profile'); } 

  return ( 
  <Tabs screenOptions={{ 
    tabBarStyle: { 
      backgroundColor: isDark ? '#021c29ff' : '#fcfdfdff', }, 
      tabBarActiveTintColor:  '#155FDC', 
      tabBarInactiveTintColor: isDark ? 'white' : '#555', 
      headerStyle: { backgroundColor: isDark ? '#021c29ff' : '#fcfdfdff', }, 
      headerTitleStyle: { color: isDark ? '#fcfdfdff' : '#155FDC',}, 
      ...Platform.select({ android: { navigationBarColor: isDark ? '#ffffff' : '#000000', 
      } }), headerTintColor: isDark ? '#fcfdfdff' : '#155FDC',  }} >

         {/* Accueil */} 
        <Tabs.Screen name="index" 
          options={{ 
            tabBarLabel: t('acc_accueil'), 
            tabBarIcon: ({ color, size }) => ( <Ionicons name="home" size={size} color={color} /> ), 
            headerStyle: { elevation: 0, // Supprime l'ombre sous le header 
                           shadowOpacity: 0,
                           backgroundColor: isDark ? "#021c29ff" : "#F6F6F6" ,
            }, 
             
            headerTitle: () => ( 
              <HStack > 
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#155FDC' }} > Buy 
                  <Text style={{ fontSize: 24, fontWeight: '800', color: 'white',textShadowColor: '#155FDC',textShadowOffset: { width: 0, height: 0 },textShadowRadius: 10,}}>More </Text>
                </Text> 
                 
              </HStack> 
            ), 
            headerRight: () => ( 
                <HStack className="items-center"> 
                  <TouchableOpacity  style={{ marginRight: 30,}} > 
                    <Ionicons name="notifications-outline" size={21} color={isDark ? 'white' : '#155FDC'} /> 
                  </TouchableOpacity> 
                   
                </HStack> 
            ), 
          }} 
        /> 


               
              {/* Historique */} 
              <Tabs.Screen name="historique" 
                options={{ title: t('his_history'), 
                  tabBarLabel: t('his_history'), 
                  tabBarIcon: ({ color, size }) => ( 
                    <AntDesign name="history" size={size} color={color} /> ), 
                  headerShown: false, 
                }} /> 

                {/* Historique */} 
              <Tabs.Screen name= "settings"
                options={{ title:  t('set_setting'), 
                  tabBarLabel: t('set_setting'), 
                  tabBarIcon: ({ color, size }) => ( 
                    <Ionicons name="settings-outline" size={size} color={color} /> ), 
                  headerShown: false, 
                }} />
                  
                {/* map */} 
                <Tabs.Screen name="map" 
                  options={{ title: t('map_map'), 
                    href: null,
                    tabBarLabel: "profil", 
                    tabBarIcon: ({ color, size }) => ( 
                      <Ionicons name="map-outline" size={size} color={color} />
                    ), 
                    headerShown: false, 
                  }} /> 
                  
                {/* PROFIL, EDITPROFIL, AIDE → MASQUÉS DU TAB */} 
                <Tabs.Screen name="profile" 
                  options={{ href: null, // masque dans le tab 
                    headerShown: false, 
                    tabBarStyle: { display: 'none' } }} 
                /> 
                    
                <Tabs.Screen name="editProfil" 
                  options={{ href: null, // masque dans le tab 
                  headerShown: false, 
                  tabBarStyle: { display: 'none' } }} 
                /> 

                <Tabs.Screen name="scanCode" 
                  options={{ href: null, // masque dans le tab 
                    headerShown: false, 
                    tabBarStyle: { display: 'none' } }}
                 /> 
                    
              </Tabs> );
         }