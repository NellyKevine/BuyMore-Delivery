import { Box } from "@/components/ui/box";
import { useLg } from '../../components/langue/MyLanguageProvider';
import { TouchableOpacity, TouchableWithoutFeedback,Image } from 'react-native';
import {Button,ButtonText} from "@/components/ui/button";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "@/components/user/MyUserProvider";
import { SafeAreaView } from 'react-native-safe-area-context';
import {LinearGradient} from "expo-linear-gradient"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { View , BackHandler} from "react-native";
import { Input, InputField } from '@/components/ui/input';
import { ChevronDownIcon, Icon, SunIcon,MoonIcon, GlobeIcon, ArrowLeftIcon, ArrowRightIcon, AlertCircleIcon } from "@/components/ui/icon";
import { StyleSheet } from "react-native";
import { Keyboard } from 'react-native';
import { useEffect, useState } from "react";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import type {User} from "@/components/user/MyUserProvider";

import { Divider } from "@/components/ui/divider";

export default function Connexion() {

  
  const {locale,t} = useLg()
  const router = useRouter();
  const {isLoggedIn, login } = useUser();
  const comeBack = () => {
    router.push('/'); 
  };

  const goToHome = () => {
    router.push("/");
  };

  const [canLeave, setCanLeave] = useState(false); // false = on bloque le retour

  

  
    useEffect(() => {
      const handleBackPress = () => {
        if (!canLeave) {
          
          return true; // bloque le bouton "retour" Android
        }
        return false; // laisse passer le retour si l’action a été faite
      };
  
      // Active le blocage du bouton retour Android
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
  
      // Nettoyage quand on quitte la page
      return () => backHandler.remove();
    }, [canLeave]);

    useEffect(() => {
      if(isLoggedIn===true){
        exit();
      }
    }, [isLoggedIn]);

  const [inputNumber, setInputNumber] = useState('');
    
  const [phoneError, setPhoneError] = useState('');
    
      // Validation
      const validateForm = () => {
        let isValid = true;
    
        if (!inputNumber || inputNumber.length != 9 ) {
          setPhoneError('Numéro de téléphone invalide');
          isValid = false;
          
        } else {
          setPhoneError('');
        }
    
        return isValid;
      };
      
      const exit = () => {
        setCanLeave(true);
        console.log("Deconstruit")
        goToHome();
      };
    
      const handleSubmit = () => {
        if (validateForm()) {
          Keyboard.dismiss(); 
          
          login(inputNumber);

         
          
        }
      };


   return (
    <LinearGradient
       style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center' }}
  colors={['#4D179A','#9e9c9cff', '#4D179A']}
  start={[1, 1]}
  end={[1, 0]}
      >
    <SafeAreaView style={{ flex: 1 }} className="w-full " edges={['top']}> 
     {/* <Box className="bg-background-50 flex-1 justify-start items-start p-4">
        <Button
          variant="link"
          action="primary"
          onPress={comeBack}
        >
          <Ionicons name="arrow-back" size={20} className="text-fc_secondary" />
        </Button>
        
      </Box>*/}
      <VStack className="flex-3/4 w-full pl-5 py-12 items-start" space="lg" >
      <HStack space="4xl" className="w-full justify-between pr-10">
              <Text bold size="5xl" className="text-white ">
              BuyMore
              </Text>
              <TouchableOpacity onPress={comeBack} className="" >
                <Ionicons name="chevron-forward" size={30} color="white" />
               </TouchableOpacity>
      </HStack>
      
      <Text bold size="4xl" className="text-white ">{t("con_connexion")}</Text>
      <VStack  className="items-start ml-2" >
        <Text style={{marginBottom:-5}} className="text-white">{t("con_message")}  </Text>
        <Button variant="link" size="md" onPress={() => router.push('/signup')}>
          <Text underline style={{color:'#3280FF'}}>{t("con_inscrire")}</Text>
        </Button>
      </VStack>
      </VStack>
      
      
      <VStack className="flex-1 w-full bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <KeyboardAwareScrollView
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
                  extraHeight={100}          // Hauteur supplémentaire quand le clavier apparaît
                  enableOnAndroid={true}     // Active le comportement sur Android
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  >
                    
      <VStack space="lg">
        <FormControl isInvalid={!!phoneError} size="md">
        <VStack style={{ width: '100%',marginLeft:8 }} className="items-start mt-6 px-10">
          <Text className="text-black" >{t("con_numero")}</Text>
          <HStack>
          <View style={{ flex: 0.2, marginRight: 10,marginLeft:7 ,marginBottom:5}}>
            
            <Input variant="underlined" size="sm" isDisabled  >
              <InputField value="+237" />
              <Ionicons name="chevron-down" size={17} color="#737374ff" />
            </Input>
          </View>
          
          <View style={{ flex: 0.7, }}>
            <Input variant="underlined" size="sm">
              <InputField placeholder={t("con_numero")} 
              onChangeText={(text) => { setInputNumber(text);
                                        if (phoneError) setPhoneError('');
                                      }}
                  keyboardType="phone-pad"
              />
             
            </Input>
          </View>
          </HStack>
          {phoneError && (
                            <FormControlError>
                              <FormControlErrorIcon as={AlertCircleIcon} />
                              <FormControlErrorText>{phoneError}</FormControlErrorText>
                              </FormControlError>
                          )}
        </VStack>
        </FormControl>
        <VStack space="xs" className="mt-7" >
                <Button variant="solid" size="lg" action="primary" onPress={handleSubmit}  style={{ backgroundColor: '#4D179A', width: '70%', alignSelf: 'center',borderRadius: 10 }}>
            <ButtonText style={{ color: 'white' }}>{t("con_connexion")}</ButtonText>
          </Button>

        </VStack>
        <View
  style={{
    height: 1,
    backgroundColor: '#cac5c5ff',
    width: '50%',
    alignSelf: 'center',  // centre la barre horizontalement
    marginTop:30
  }}

/>
      
    
      <Text className="text-black mx-10 text-center" >{t("con_conditions")} <Text style={{color:'#3280FF'}} >{t("con_term")}</Text>{t("con_conf")}</Text>
    

      </VStack>
      </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
      </VStack>

      
    

    </SafeAreaView>
    </LinearGradient>
  );
}
 
    
     

