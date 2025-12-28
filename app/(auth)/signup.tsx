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
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useUser } from "@/components/user/MyUserProvider";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Image, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLg } from "../../components/langue/MyLanguageProvider";

export default function Inscription() {
  const { locale, t } = useLg();
  const router = useRouter();
  const goToConnexion = () => {
    router.push("/login");
  };
  const {  } = useUser();



  const [canLeave, setCanLeave] = useState(false); // false = on bloque le retour

 

  useEffect(() => {
    const handleBackPress = () => {
      if (!canLeave) {
        return true; //  bloque le bouton "retour" Android
      }
      return false; //  laisse passer le retour si l’action a été faite
    };

    // Active le blocage du bouton retour Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Nettoyage quand on quitte la page
    return () => backHandler.remove();
  }, [canLeave]);

  const toast = useToast();

  // ✅ Tous les states
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");

  // ✅ États d'erreur
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // ✅ Validation
  const validateForm = () => {
    let isValid = true;

    if (!inputName || inputName.trim().length < 3) {
      setNameError("Le nom doit contenir au moins 3 caractères");
      isValid = false;
    } else {
      setNameError("");
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

  const handleSubmit = () => {
    if (validateForm()) {
      Keyboard.dismiss();
      //signup(inputName, inputEmail);
      setCanLeave(true);
      goToConnexion();
    }
  };

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
      <SafeAreaView
        style={{ flex: 1 }}
        className="w-full bg-white "
        edges={["bottom"]}
      >
        <LinearGradient
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
          colors={["rgba(0, 0, 0, 0.93)", "#155FDC"]}
          start={[1, 1]}
          end={[1, 0]}
        >
          {/* <Box className="bg-background-50 flex-1 justify-start items-start p-4">
        <Button
          variant="link"
          action="primary"
          onPress={comeBack}
        >
          <Ionicons name="arrow-back" size={20} className="text-fc_secondary" />
        </Button>
        
      </Box>*/}
          <VStack
            className="flex-3/4 w-full pl-5 py-12 pt-14 items-start"
            space="lg"
          >
            <HStack space="4xl" className="w-full justify-between pr-10">
              <Text bold size="5xl" className="text-fc-variant ">
              BuyMore
              </Text>
              <TouchableOpacity onPress={comeBack} className="" >
                <Ionicons name="chevron-forward" size={30} color="white" />
               </TouchableOpacity>
            </HStack>
            

            <Text bold size="4xl" className="text-white w-1/2">
              S'inscrire a BuyMore
            </Text>
            <VStack className="items-start ml-2">
              <Text style={{ marginBottom: -5 }} className="text-white">
                Tu as deja un compte ?
              </Text>
              <Button
                variant="link"
                size="md"
                onPress={() => router.push("/login")}
              >
                <Text underline style={{ color: "#3280FF" }}>
                  Se connecter
                </Text>
              </Button>
            </VStack>
          </VStack>

          <VStack space="xl" className="flex-1 w-full bg-white items-center">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
                extraHeight={100} // Hauteur supplémentaire quand le clavier apparaît
                enableOnAndroid={true} // Active le comportement sur Android
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <VStack space="lg">
                  <FormControl isInvalid={!!nameError} size="md">
                    <VStack space="xs" className="w-full px-10 mt-10">
                      <Text className="text-black">Nom D'utilisateur</Text>
                      <Input
                        variant="outline"
                        size="lg"
                        isDisabled={false}
                        isInvalid={false}
                        isReadOnly={false}
                        style={{ marginLeft: 2, borderRadius: 5 }}
                      >
                        <InputField
                          placeholder="stella"
                          onChangeText={(text) => {
                            setInputName(text);
                            if (nameError) setNameError("");
                          }}
                        />
                      </Input>

                      {nameError && (
                        <FormControlError>
                          <FormControlErrorIcon as={AlertCircleIcon} />
                          <FormControlErrorText>
                            {nameError}
                          </FormControlErrorText>
                        </FormControlError>
                      )}
                    </VStack>
                  </FormControl>
                  <FormControl isInvalid={!!emailError} size="md">
                    <VStack space="xs" className="w-full px-10">
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
                          placeholder="stella@gmail.com"
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
                  
                  <VStack space="lg" className="w-full items-center mt-5">
                    <Button
                      variant="solid"
                      size="lg"
                      action="primary"
                      onPress={handleSubmit}
                      style={{
                        backgroundColor: "#3280FF",
                        width: "70%",
                        borderRadius: 10,
                      }}
                    >
                      <ButtonText style={{ color: "white" }}>
                        S'inscrire
                      </ButtonText>
                    </Button>
                    <HStack  space="md" className="items-center justify-center w-full mt-5" >
                      <Divider className="w-20 " /> 
                      <Text>Ou S'inscrire avec </Text>
                      <Divider className="w-20 " />
                    </HStack>
                    
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
            </TouchableWithoutFeedback>
          </VStack>
        </LinearGradient>
      </SafeAreaView>
    </LinearGradient>
  );
}
