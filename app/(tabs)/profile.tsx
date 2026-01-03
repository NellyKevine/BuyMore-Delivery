import { useLg } from "../../components/langue/MyLanguageProvider";
import type { Locale } from "../../components/langue/i18n";
import { Fab, FabIcon } from '@/components/ui/fab';
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon, Icon, SunIcon,MoonIcon, GlobeIcon, ArrowRightIcon } from "@/components/ui/icon";
import {useCameraPermissions, CameraView} from "expo-camera";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Ionicons, FontAwesome5, Feather, FontAwesome } from '@expo/vector-icons';


import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { useTheme } from "../../components/theme/MyThemeProvider";
import {useUser} from "../../components/user/MyUserProvider";
import {  useRouter } from 'expo-router';
import {  TouchableOpacity,StatusBar, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {  EditIcon } from '@/components/ui/icon';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useLg();
  const { user, isLoggedIn, logout } = useUser();

  const [permission, requestPermission] = useCameraPermissions();// Pour demander la permission a notre utilisateur pour pouvoir utiliser sa camera
  const isPermissionGranted = permission?.granted; //(boolean) Pour s'assurer qu'on nous a deja donner la permission
  
  const router = useRouter();

   const handleLogin = () => {
    router.push('/login'); 
  };

  

  const handleLogout = () => {
    logout();
  };
 
  const comeBack = () => {
    router.push('/'); 
  };

  const goToEditProfil = () => {
    router.push('/(tabs)/editProfil'); 
  };

  const scanCode = async () => {
  if (!isPermissionGranted) {
    const { granted } = await requestPermission();

    if (granted) {
      router.push('/(tabs)/scanCode');
    }
  } else {
    router.push('/(tabs)/scanCode');
  }
};


  return (
    <SafeAreaView className="flex-1 bg-fc-primary " edges={['top']}>

        {isDark?<StatusBar translucent backgroundColor="transparent" barStyle="light-content" />:<StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />}
        <VStack space="md" reversed={false} className=" flex-1 items-center " style={{ backgroundColor: isDark ? "#021c29ff" : "#F6F6F6" }}>
            {isLoggedIn?(
                <HStack className=" p-1 border border-typography-200 rounded-full absolute top-[6rem] left-1/3 z-10 bg-white">
                    <Avatar size="2xl" className="bg-yellow-400  ">
                        {user.uriImage?
                            <AvatarImage
                            source={{
                                    uri: user.uriImage,
                                    }} 
                            /> :
                            <AvatarFallbackText className="text-white">{user.name || 'User'}</AvatarFallbackText>}
                    </Avatar>
                </HStack>
            ):(
                <HStack className=" p-1 border border-typography-300 rounded-full absolute top-[6rem] left-1/3 z-10 bg-white z-10">
                <Avatar size="2xl" className="bg-yellow-400 ">
                    <Ionicons name="person" size={40} color="white" />
                </Avatar>   
                </HStack>
            )}
            <VStack space="2xl"className="bg-fc-primary w-full p-4 rounded-b-[8vw]  relative  items-center ">
                
                <HStack space="2xl" className="mt-2 w-full items-center">
                    <TouchableOpacity onPress={comeBack} className="" >
                        <Ionicons name="chevron-back" size={30} color="white" />
                    </TouchableOpacity>
                    <Text size="2xl" bold className="text-white text-center ">{t("pro_profil")}</Text>
                    <VStack  className=" flex-1 items-end">
                        <Button variant="link" size="md" className="p-0">
                            <FontAwesome5 name="crown" size={18} color="#FFD700" />
                            <ButtonText className="text-fc-gold font-bold">Premium</ButtonText>
                            <ButtonIcon className="mr-1 text-fc-gold" size="xl" as={ArrowRightIcon} />
                        </Button>
                    </VStack> 
                </HStack>
                
                
                <VStack space="xs" className=" mr-20  relative top-8 items-center mb-10 h-[2rem]  w-full  items-end">

                    <HStack space="4xl" className=" w-2/5">
                        {isLoggedIn?(
                            <Text className="text-white text-center text-xl font-bold  truncate"></Text>
                            ):(
                            <Text className="text-white text-center text-xl font-bold">
                                        
                            </Text> 
                        )}
                    </HStack>
                </VStack>
    
            </VStack>
            <VStack space="4xl" className="my-10 w-full flex-1 h-full items-center">
                {isLoggedIn && (
                <Button variant="solid"  size="md" className="bg-fc-secondary rounded-full mt-7    " isPressed={false} onPress={goToEditProfil}>
                    <Feather name="edit-3" size={18} color="white" />
                    <ButtonText className="text-white text-center font-semibold">{t("set_editProfil")}</ButtonText>
                </Button> 
                    
                )}
                <VStack space="md" className=" w-full h-full mt-7 flex-1 items-center px-10">

                        <HStack space="md" reversed={false} className="items-center justify-center w-full justify-between"> 
                            <HStack space="md" className="items-center">
                            <FontAwesome name="user" size={24} color="#d8b02bff" />
                            <Text size="lg" bold>{t("set_nom")}</Text>
                            </HStack>
                            <Text className="text-typography-500 text-sm opacity-80 ml-6">{isLoggedIn?user.name:"UserName"}</Text>
                        </HStack> 

                        <Divider className="my-2"/>

                        <HStack space="md" reversed={false} className="items-center justify-center w-full justify-between"> 
                            <HStack space="md" className="items-center">
                            <Ionicons name="mail" size={20} color="#d8b02bff" />
                            <Text size="lg" bold>Email</Text>
                            </HStack>
                            <Text className="text-typography-500 text-sm opacity-80 ml-6">{isLoggedIn?user.email:"emailUser@gmail.com"}</Text>
                        </HStack>

                        <Divider className="my-2"/>
                    
                        <HStack space="md" reversed={false} className=" justify-center items-center w-full justify-between "> 
                            <HStack space="md" className="items-center">
                            <FontAwesome5 name="history" size={20} color="#d8b02bff" />
                            <Text size="lg" bold>{t("pro_trajet")}</Text>
                            </HStack>
                            <Text className="text-typography-500 text-sm opacity-80 ml-6">Ngousso - MaKene</Text>
                        </HStack> 

                        <Divider className="my-2"/>

                        {isLoggedIn && (
                            <><Pressable  onPress={scanCode}  >
                            <HStack space="md" reversed={false} className=" items-center w-full justify-between "> 
                                <HStack space="md" className="items-center">
                                <Ionicons name="qr-code-outline" size={24} color="#d8b02bff"  />
                                <Text size="lg" bold>{t("connect_qrcode")}</Text>
                                </HStack>
                                <Ionicons name="chevron-forward" size={15} color="#d8b02bff" />
                                {/*<Text className="text-typography-500 text-sm opacity-80 ml-6">Ngousso - MaKene</Text>*/}
                            </HStack>
                        </Pressable>
                        <Divider className="my-2"/>
                        </>)}

                        
                        
                        {isLoggedIn? (
                            <VStack space="sm" className="p-4 mt-5 ">
                                <Button variant="solid" action="negative" onPress={handleLogout} className="bg-fc-error" >
                                    <Ionicons name="log-out-outline" size={20} color="white" />
                                    <ButtonText className="ml-1 text-white">{t('logout')}</ButtonText>
                                </Button>
                            </VStack>
                        ):(
                    
                    <VStack space="sm" className="p-4 mt-5 ">
                        <Button variant="link" action="primary" onPress={handleLogin} size="lg">
                            <Ionicons name="log-in-outline" size={20} color="#d8b02bff" />
                            <ButtonText className="ml-2 text-black font-bold text-fc-primary">{t('con_connexion')}</ButtonText>
                            <ButtonIcon className="mr-1 text-black text-fc-primary" size="xl" as={ArrowRightIcon} />
                        </Button>
                        
                        
                    </VStack>
                     )}
                </VStack>
                
                
            </VStack>
        </VStack>
    </SafeAreaView>
  );
}