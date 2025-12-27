import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import { useTheme } from "../../components/theme/MyThemeProvider";
import {useUser} from "../../components/user/MyUserProvider";
import { useLg } from "../../components/langue/MyLanguageProvider";
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { MenuIcon } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';
import {useState} from "react";
import {  useRouter } from 'expo-router';

export function DrawerLayout() {
    const [showDrawer, setShowDrawer] = useState(false);
    const { t, locale, setLocale } = useLg();
    const { user, isLoggedIn, logout } = useUser();
  
    const router = useRouter();
   
    const handleLogin = () => {
       router.push('/login'); 
    };
   
    const handleSignup = () => {
       router.push('/signup'); 
    };

    const goToProfile = () => {
       router.push('/profile'); 
    };

    const goToDeliveries = () => {
       router.push('/deliveries'); 
    };

    const goToMap = () => {
       router.push('/map'); 
    };

    const goToHome = () => {
       router.push('/'); 
    };

    const goToHistorique = () => {
       router.push('/historique'); 
    };
   
    const handleLogout = () => {
       logout();
    };

  return (
    <>
      <Pressable
        onPress={() => {
          setShowDrawer(true);
        }}
      >
        <Icon as={MenuIcon} size="xl" className="text-white" />
        
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
        <DrawerContent className="w-[270px] md:w-[300px] py-10">
          <DrawerHeader className="justify-center flex-col gap-2">
            <Avatar size="2xl" className="bg-indigo-600  ">
                {user.uriImage?
                    <AvatarImage source={{ uri: user.uriImage,}}/> 
                    :
                    <AvatarFallbackText className="text-white">{user.name || 'User'}</AvatarFallbackText>
                }
            </Avatar>
            <VStack className="justify-center items-center">
             
              <Text className="h-[2rem] text-lg font-bold truncate">{user.name}</Text>
              <Text className=" text-sm opacity-80 truncate">{user.email}</Text>
            </VStack>
          </DrawerHeader>
          <Divider className="my-4" />
          <DrawerBody contentContainerClassName="gap-2">
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <Feather name="user" size={24} color="black" />
              <Text size="lg" className="font-bold text-typography-800">My Profile</Text>
            </Pressable>
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="black" />
              <Text size="lg" className="font-bold text-typography-800">Dashboard</Text>
            </Pressable>
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <MaterialIcons name="delivery-dining" size={24} color="black" />
              <Text size="lg" className="font-bold text-typography-800">Livraison du jour</Text>
            </Pressable>
            
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <Ionicons name="map-outline" size={30} color=" #bebfc2ff" />
              <Text size="lg" className="font-bold text-typography-800">Map</Text>
            </Pressable>
            <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <MaterialIcons name="history" size={24} color="black" />
              <Text size="lg" className="font-bold text-typography-800">Historique des livraisons</Text>
            </Pressable>
          </DrawerBody>
          <DrawerFooter>
            {!isLoggedIn? (
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
                        
                    <Button variant="solid" onPress={handleSignup} className="shadow-sm bg-fc-tertiary" >
                        <ButtonText className="ml-1 font-bold text-white">{t('ins_inscription')}</ButtonText>
                        <MaterialIcons name="login" size={24} color="white" className="text-fc-tertiary" />
                    </Button>
                </VStack>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
