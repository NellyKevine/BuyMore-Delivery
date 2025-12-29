import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from '@/components/ui/drawer';
import { EvilIcons, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import { useTheme } from "../../components/theme/MyThemeProvider";
import {useUser} from "../../components/user/MyUserProvider";
import { useLg } from "../../components/langue/MyLanguageProvider";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { MenuIcon } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';
import {useState} from "react";
import {  useRouter } from 'expo-router';
import { HStack } from '../ui/hstack';
import { Fab } from '../ui/fab';

export function DrawerLayout() {
    const [showDrawer, setShowDrawer] = useState(false);
    const { t, locale, setLocale } = useLg();
    const { user, isLoggedIn, logout } = useUser();
  
    const router = useRouter();
   
    const handleLogin = () => {
       router.push('/login'); 
       setShowDrawer(false);
    };
   
    const handleSignup = () => {
       router.push('/signup'); 
       setShowDrawer(false);
    };

    const goToSetting = () => {
       router.push('/settings'); 
       setShowDrawer(false);
    };

    const goToDeliveries = () => {
       router.push('/deliveries'); 
       setShowDrawer(false);
    };

    const goToMap = () => {
       router.push('/map'); 
       setShowDrawer(false);
    };

    const goToHome = () => {
       router.push('/'); 
       setShowDrawer(false);
    };

    const goToHistorique = () => {
       router.push('/historique'); 
       setShowDrawer(false);
    };
   
    const handleLogout = () => {
       logout();
       setShowDrawer(false);
    };

  return (
    <>
      <Pressable
        onPress={() => {
          setShowDrawer(true);
        }}
        style={{ marginRight: 20 }}
      >
        <Icon as={MenuIcon} size="xl" className="text-fc-primary" />
        
      </Pressable>
      <Drawer
        isOpen={showDrawer}
        size="sm"
        anchor="right"
        onClose={() => {
          setShowDrawer(false);
        }}
        
      >
        <DrawerBackdrop />
        <DrawerContent className="w-[240px] md:w-[300px] py-11 bg-stone-200">
          <DrawerHeader className="justify-center flex-col gap-2 mt-5" >
            
            <DrawerCloseButton className="absolute top-0 left-0 bg-neutral-400/25 w-10 h-10 justify-center items-center rounded-full " style={{ marginLeft: -6 }}>
              <EvilIcons name="close" size={24} color="#155FDC" />
            </DrawerCloseButton>
            
            <Avatar size="2xl" className="bg-white mt-10 border-2 border-white shadow-sm">
                {user.uriImage?
                    <AvatarImage source={{ uri: user.uriImage,}}/> 
                    
                    :
                    <AvatarFallbackText className="text-fc-neutral">{user.name || 'User'}</AvatarFallbackText>
                }
                <AvatarBadge />
            </Avatar>
            {isLoggedIn ? ( <VStack className="justify-center items-center">
             
              <Text className="h-[2rem] text-lg font-bold truncate">{user.name}</Text>
              <Text className=" text-sm opacity-80 truncate">{user.email}</Text>
            </VStack>) : (
              <VStack className="mt-5"/>
            )}
          </DrawerHeader>
          <Divider className="my-4" />
          <DrawerBody contentContainerClassName="gap-2">
            
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md" onPress={goToHome}>
              <HStack className="w-full justify-between items-center" >
                <HStack className="gap-3 flex-row items-center ">
                  <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="black" />
                  <Text size="lg" className="font-bold text-typography-800">Dashboard</Text>
                </HStack>
                <Ionicons name="chevron-forward" size={15} color="gray" />
              </HStack>
            </Pressable>
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md" onPress={goToDeliveries}>
              <HStack className="w-full justify-between items-center" >
                <HStack className="gap-3 flex-row items-center ">
                  <MaterialIcons name="delivery-dining" size={24} color="black" />
                  <Text size="lg" className="font-bold text-typography-800">Livraison du jour</Text>
                </HStack>
                <Ionicons name="chevron-forward" size={15} color="gray" />
              </HStack>
            </Pressable>
            
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md" onPress={goToMap}>
              <HStack className="w-full justify-between items-center" >
                <HStack className="gap-3 flex-row items-center ">
                  <Ionicons name="map-outline" size={24} color=" #bebfc2ff" />
                  <Text size="lg" className="font-bold text-typography-800">Map</Text>
                </HStack>
                <Ionicons name="chevron-forward" size={15} color="gray" />
              </HStack>
            </Pressable>
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md" onPress={goToHistorique}>
              <HStack className="w-full justify-between items-center" >
                <HStack className="gap-3 flex-row items-center ">
                  <MaterialIcons name="history" size={24} color="black" />
                  <Text size="lg" className="font-bold text-typography-800">Historiques</Text>
                </HStack>
                <Ionicons name="chevron-forward" size={15} color="gray" />
              </HStack>
            </Pressable>
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md" onPress={goToSetting}>
              <HStack className="w-full justify-between items-center" >
                <HStack className="gap-3 flex-row items-center ">
                  <Ionicons name="settings-outline" size={24} color="black" />
                  <Text size="lg" className="font-bold text-typography-800">Settings</Text>
                </HStack>
                <Ionicons name="chevron-forward" size={15} color="gray" />
              </HStack>
            </Pressable>
          </DrawerBody>
          <DrawerFooter className="mb-8">
            {isLoggedIn? (
                <VStack space="sm" className="w-full gap-2">
                    <Button variant="solid" action="negative" onPress={handleLogout} className="bg-fc-error" >
                        <ButtonText className="ml-1 text-white">{t('logout')}</ButtonText>
                        <MaterialIcons name="logout" size={24} color="white" />
                    </Button>
                </VStack>
            ):(
                <VStack space="sm" className="p-4 mt-5 ">
                    <Button variant="solid" action="primary" onPress={handleLogin} size="lg" className="bg-fc-primary">
                        <ButtonText className="ml-2 text-black font-bold text-white">{t('con_connexion')}</ButtonText>
                        <MaterialIcons name="login" size={24} color="#ffff" />
                    </Button>
                        
                    
                </VStack>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
