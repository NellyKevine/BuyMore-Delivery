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
import { ChevronDownIcon, Icon, SunIcon,MoonIcon, GlobeIcon, ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icon";
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
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

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

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useLg();
  const { user, isLoggedIn, logout } = useUser();
  
  //  Synchronisé avec isDark
  const [isSwitchOn, setIsSwitchOn] = useState(isDark);

  const [langue, setLangue] = useState(
    locale === "fr" ? "Français" : "English"
  );

  

  const handleLogout = () => {
    logout();
  };

  {/*const goToAide = () => {
    router.push('/(tabs)/aide'); 
  };*/}

  //  Fonction pour gérer le changement de thème
  const handleToggleTheme = (value: boolean): void => {
    setIsSwitchOn(value);
    toggleTheme();
  };

  // Fonction pour gérer le changement de langue
  const handleLanguageChange = (value: string): void => {
    setLocale(value as Locale);
  };

  const router = useRouter();
  const comeBack = () => {
    router.push('/'); 
  };

  //  Déterminer le thème actuel
  const currentTheme = isDark ? "Sombre" : "Clair";
  const currentLangue = locale === "fr" ? "Français" : "English";
  return (
    <SafeAreaView className="flex-1 bg-fc-primary " edges={['top']}>
      {isDark?<StatusBar translucent backgroundColor="transparent" barStyle="light-content" />:<StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />}
              
      <VStack space="md" reversed={false} className="flex-1 items-center" style={{ backgroundColor: isDark ? "#021c29ff" : "#F6F6F6" }}
>
        <VStack space="2xl"className="bg-fc-primary relative w-full p-4 rounded-br-[8vw] ">
          {isLoggedIn?(
                <HStack className=" p-1 border border-typography-200 rounded-full absolute top-[6rem] left-10 z-10 bg-white">
                    <Avatar size="2xl" className="bg-yellow-400  ">
                        {user.uriImage?
                          <AvatarImage source={{ uri: user.uriImage,}} /> 
                          :
                          <AvatarFallbackText className="text-white">{user.name || 'User'}</AvatarFallbackText>
                        }
                    </Avatar>
                </HStack>
            ):(
                <HStack className=" p-1 border border-typography-300 rounded-full absolute top-[6rem] left-10 z-10 bg-white z-10">
                <Avatar size="2xl" className="bg-yellow-400 ">
                    <Ionicons name="person" size={40} color="white" />
                </Avatar>   
                </HStack>
            )}
            <VStack space="2xl"className="bg-fc-primary w-full p-3 px-0 rounded-b-[10vw]  relative  items-center ">
                
                <HStack space="2xl" className="w-full  ">
                    <TouchableOpacity onPress={comeBack} className="" >
                        <Ionicons name="chevron-back" size={30} color="white" />
                    </TouchableOpacity>
                    
                    <Text size="2xl" bold className="text-white text-center ">{t("set_setting")}</Text>
                    <VStack  className=" flex-1 items-end">
                        <Button variant="link" size="md" className="p-0">
                            <FontAwesome5 name="crown" size={18} color="#FFD700" />
                            <ButtonText className="text-fc-gold font-bold">Premium</ButtonText>
                            <ButtonIcon className="mr-1 text-fc-gold" size="xl" as={ArrowRightIcon} />
                        </Button>
                    </VStack> 
                </HStack>
                
                
                <VStack space="xs" className=" mr-20  relative top-3  items-center mb-5  w-full  items-end">

                    <HStack space="4xl" className=" w-2/5">
                        {isLoggedIn?(
                            <Text className="text-white text-center text-xl font-bold  truncate">{user.name}</Text>
                            ):(
                            <Text className="text-white text-center text-xl font-bold">
                                        {t('notLoggedIn')}
                            </Text> 
                        )}
                    </HStack>
                </VStack>
    
            </VStack>
              
        </VStack>
        
        <VStack className="items-center w-full h-full px-6 py-10 mt-8" space="xl" reversed={false}>
          
          {/* Section Thème */}
          <HStack space="md" reversed={false} className="justify-between items-center " >
            <HStack space="md" reversed={false} className="items-center flex-1"> 
              {isDark? (<Ionicons name="moon" size={20} color="#44498dff" />): (<Ionicons name="sunny-outline" size={20} color="#FFD700" />)}
              <VStack space="xs" reversed={false} className="flex-1">
                <Text size="lg" bold>
                  {t("set_theme")}
                </Text>
                <Text size="sm" className="text-gray-500">
                  {t("set_themeActuelle.theme", {
                    theme: currentTheme==='Clair' ? t("set_clair") :  t("set_sombre")
                    }  
                    )}
                </Text>
              </VStack>
            </HStack> 

            <Switch
              size="md"
              value={isSwitchOn}
              onValueChange={handleToggleTheme}
              trackColor={{ false: "#d4d4d4", true: "#FFD700" }}
              thumbColor="#fafafa"
              ios_backgroundColor="#d4d4d4"
            />
          </HStack>

          <Divider/>

          {/* Section Langue */}
          <HStack space="md" reversed={false} className="justify-between items-center">
            <HStack space="md" reversed={false} className="items-center flex-1"> 
              <Ionicons name="globe-outline" size={20} color="#d8b02bff" />
              <VStack space="xs" reversed={false} className="flex-1">
                <Text size="lg" bold> {t("set_langue")} </Text>
                <Text size="sm" className="text-gray-500"> {t("set_langueActuelle.langue", { langue: currentLangue })} </Text>
              </VStack>
            </HStack>

            {/* Select correctement dimensionné */}
            <Box className="w-32">
              <Select onValueChange={handleLanguageChange} selectedValue={locale} initialLabel={currentLangue}>
                <SelectTrigger variant="underlined" size="sm">
                  <SelectInput placeholder={t("set_langue")} />
                  <SelectIcon as={ChevronDownIcon} className="ml-12" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label={t("set_francais")} value="fr" />
                    <SelectItem label={t("set_anglais")} value="en" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
          </HStack> 
          <Divider  />
          
            <Pressable >
              <HStack space="md" reversed={false} className=" w-full justify-between items-center">
                <HStack space="md" className="items-center">
                  <Ionicons name="help-circle-outline" size={24} color="#d8b02bff" />
                  <Text size="lg" bold>{t("set_aide")}</Text>
                </HStack>
                
                <Ionicons name="chevron-forward" size={15} color="gray" />
              </HStack>
            </Pressable>
            <Divider/>
            <Pressable >
              <HStack space="md" className=" w-full justify-between items-center">
                <HStack space="md" className="items-center">
                  <Ionicons name="shield-checkmark-sharp" size={24} color="#d8b02bff" />
                  <Text size="lg" bold>{t("set_politique")}</Text>
                </HStack>  
                
                <Ionicons name="chevron-forward" size={15} color="gray" />
              </HStack>
            </Pressable>
            <Divider/>
            <Pressable >
              <HStack space="xl" className="w-full justify-between items-center">
                <HStack space="md" className="items-center">
                  <Ionicons name="document-text-outline" size={24} color="#d8b02bff" />
                  <Text size="lg" bold>{t("set_conditionUse")}</Text>
                </HStack>
                
                <Ionicons name="chevron-forward" size={15} color="gray" />
              </HStack>
            </Pressable>
            <Divider/>
              {isLoggedIn &&(
                <VStack space="md" className="">
                  
                  <Pressable  onPress={handleLogout}  >
                    <HStack space="xl" className="w-full justify-between items-center">
                      <HStack space="md" className="items-center">
                        <Ionicons name="log-out-outline" size={20} color="red" />
                        <Text size="lg" bold className="text-red-600">{t('logout')}</Text>
                      </HStack>
                      <Ionicons name="chevron-forward" size={15} color="red" />
                    </HStack>
                  </Pressable>
                </VStack>
                
              )}
              {isLoggedIn && (<Divider/>)}
          
              
        </VStack>
  
      </VStack>
    </SafeAreaView>
  );
}