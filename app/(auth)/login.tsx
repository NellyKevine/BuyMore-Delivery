import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useUser } from "@/components/user/MyUserProvider";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Image, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLg } from "../../components/langue/MyLanguageProvider";
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Box } from "@/components/ui/box";


export default function Inscription() {
  const { locale, t } = useLg();
  const router = useRouter();
  const goToConnexion = () => {
    router.push("/login");
  };
  const { login } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const [isLoggingIn, setIsLoggingIn] = useState(false); // ← État LOCAL

  const toast = useToast();

  // ✅ Tous les states
  const [password, setPassWord] = useState("");
  const [inputEmail, setInputEmail] = useState("");

  // ✅ États d'erreur
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  // ✅ Validation
  const validateForm = () => {
    let isValid = true;

    if (!password || password.trim().length < 6) {
      setPasswordError("Le nom doit contenir au moins 3 caractères");
      isValid = false;
    } else {
      setPasswordError("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail || !emailRegex.test(inputEmail)) {
      setEmailError("Email invalide");
      isValid = false;
    } else {
      setEmailError("");
    }

    

    return isValid;
  };

   const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoggingIn(true); // ← Désactive bouton + affiche "en cours"
      Keyboard.dismiss();
      try {
        await login(inputEmail.trim(), password);
        // Si succès → le provider redirige déjà vers "/"
      } catch (error) {
        // Les erreurs sont déjà affichées par Alert dans le provider
      } finally {
        setIsLoggingIn(false); // ← Retour à normal
      }
      goToConnexion();
    }
  }
  const comeBack = () => {
    router.push('/'); 
  };

  return (
    <LinearGradient
      style={{ flex: 1, width: "100%", height: "100%", alignItems: "center" }}
      colors={["rgba(0, 0, 0, 0.93)", "#155FDC"]}
      start={[1, 1]}
      end={[1, 0]}
    >
      <SafeAreaView style={{ flex: 1 }} className="w-full " edges={['top']}>
        
          
          <VStack
            className="flex-3/4 w-full pl-5 py-12 pt-14 items-start"
            space="xl"
          >
            <HStack space="4xl" className="w-full justify-between items-center pr-10">
              <HStack space="md" className="items-center mb-2">
                <Box className="bg-stone-50/25 p-2 rounded-xl">
                  <MaterialCommunityIcons name="truck-delivery-outline" size={27} color="white" />
                </Box>
                <Text bold size="2xl" className="text-white">
                BuyMore
                </Text>
              </HStack>
              <TouchableOpacity onPress={comeBack} className="bg-stone-50/25  items-center  justify-center rounded-full" >
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            </HStack>
            

            <Text bold size="3xl" className="text-white w-2/3">
              Se connecter à BuyMore-Delivery
            </Text>

            <Text size="xl" className="text-white w-1/2">
              Bienvenue, livreur !
            </Text>
            
          </VStack>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <VStack space="xl" className="flex-1 w-full bg-white items-center rounded-tl-full">
              <VStack space="xl" className="flex-1 w-full bg-white items-center rounded-tr-full ">
                
                  <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
                    extraHeight={100} // Hauteur supplémentaire quand le clavier apparaît
                    enableOnAndroid={true} // Active le comportement sur Android
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    className="mt-16"
                  >
                    <VStack space="lg" >
                      
                      <FormControl isInvalid={!!emailError} size="md">
                        <VStack space="xs" className="w-full px-10 ">
                          <Text className="text-black">Email </Text>
                          <Input
                            variant="outline"
                            size="lg"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                            style={{ marginLeft: 2, borderRadius: 5 }}
                          >
                            <InputField
                              placeholder= "buymore@gmail.com"
                              onChangeText={(text) => {
                                setInputEmail(text);
                                if (emailError) setEmailError("");
                              }}
                              keyboardType="email-address"
                              autoCapitalize="none"
                            />
                          </Input>

                          {emailError && (
                            <FormControlError>
                              <FormControlErrorIcon as={AlertCircleIcon} />
                              <FormControlErrorText>
                                {emailError}
                              </FormControlErrorText>
                            </FormControlError>
                          )}
                        </VStack>
                      </FormControl>

                      <FormControl isInvalid={!!passwordError} size="md">
                        <VStack space="xs" className="w-full px-10 ">
                          <Text className="text-black">Password</Text>
                          <Input className="align-center"
                            variant="outline"
                            size="lg"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                            style={{ marginLeft: 2, borderRadius: 5 }}
                          >
                            <InputField  placeholder="******" onChangeText={(text) => {setPassWord(text);
                                                                            if (passwordError) setPasswordError("");
                                                                    }} 
                              type={showPassword ? 'text' : 'password'} />
                            <InputSlot className="pr-3" onPress={handleState}>
                              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                            </InputSlot>
                            
                          </Input>

                          {passwordError && (
                            <FormControlError>
                              <FormControlErrorIcon as={AlertCircleIcon} />
                              <FormControlErrorText>
                                {passwordError}
                              </FormControlErrorText>
                            </FormControlError>
                          )}
                        </VStack>
                      </FormControl>
                      
                      <VStack space="lg" className="w-full items-center mt-5">
                        <Button
                          variant="solid"
                          size="lg"
                          action="primary"
                          onPress={handleSubmit}
                          disabled={isLoggingIn} // ← Désactive pendant le login
                          style={{
                            backgroundColor: "#3280FF",
                            width: "70%",
                            borderRadius: 10,
                          }}
                        >
                          <ButtonText className="text-white font-semibold">
                            {isLoggingIn ? "Connexion en cours..." : "Se connecter"}
                          </ButtonText>
                        </Button>

                        <Text className="text-black text-center px-5 mt-5" >
                          By signing up you agree to the {" "}
                          <Text style={{ alignSelf: "center", color: "#3280FF" }}>
                            general terms and Conditions {" "}
                          </Text>
                          of Fare Calculator
                        </Text>
                      </VStack>
                    </VStack>
                  </KeyboardAwareScrollView>
                
              </VStack>
            </VStack>
          </TouchableWithoutFeedback>
      </SafeAreaView>
    </LinearGradient>
  );
}
