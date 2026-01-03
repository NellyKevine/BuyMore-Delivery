import React, { useState } from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLg } from "../../components/langue/MyLanguageProvider";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';

import { Text } from '@/components/ui/text';
import { useUser } from '../../components/user/MyUserProvider';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HStack } from '@/components/ui/hstack';
import {  useRouter } from 'expo-router';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/components/theme/MyThemeProvider';

export default function EditProfil() {
  const { user, updateUser } = useUser();

  const [uriImage, setUriImage] = useState(user.uriImage);

  const { t } = useLg();

  const router = useRouter();

  const comeBack = () => {
    router.back(); 
  };

  // ✅ Tous les states
  const [inputName, setInputName] = useState(user.name || '');
  const [inputEmail, setInputEmail] = useState(user.email || '');

  // ✅ États d'erreur
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // ✅ Validation
  const validateForm = () => {
    let isValid = true;

    if (!inputName || inputName.trim().length < 3) {
      setNameError('Le nom doit contenir au moins 3 caractères');
      isValid = false;
    } else {
      setNameError('');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail || !emailRegex.test(inputEmail)) {
      setEmailError('Email invalide');
      isValid = false;
    } else {
      setEmailError('');
    }

    
    return isValid;
  };
  


  const handleSubmit = () => {
    if (validateForm()) {
      Keyboard.dismiss(); 
      updateUser({
        name: inputName,
        email: inputEmail,
        uriImage: uriImage,
      });
      comeBack();
    }
  };

  const reset = ()=>{
    comeBack();
    setInputName(user.name);
    setInputEmail(user.email);
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setUriImage(user.uriImage);
    
  }

  //Permet la selection d'une image dans la galerie 
  const pickImage = async () => {
  
      // Lancer le sélecteur d'images
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false, // true pour sélection multiple
        
      });
  
      console.log(result);
  
      if (!result.canceled && result.assets.length > 0) {
        setUriImage(result.assets[0].uri);
      }
    };
    const { isDark} = useTheme();

  return (
    <SafeAreaView className="flex-1 " edges={['top']} style={{ backgroundColor: isDark ? "#021c29ff" : "#F6F6F6" }}>
      <VStack className="flex-1 pt-5 px-3 items-center justify-center w-full">
        <HStack space="lg" className='w-full items-center'>
            <TouchableOpacity onPress={reset} className="ml-1" >
                <Ionicons name="chevron-back" size={30} color=" #155FDC" />
            </TouchableOpacity>
            <Text size="2xl" bold className="text-center text-fc-primary  ml-2">{t("edt_editProfil")}</Text>
        </HStack>
        <HStack className=" mt-5 p-1  border border-typography-200 rounded-full">
            <Avatar size="2xl" className="bg-indigo-600 relative ">
                {uriImage?
                    <AvatarImage source={{ uri: uriImage,}} /> 
                    :
                    <AvatarFallbackText className="text-white">{user.name || 'User'}</AvatarFallbackText>
                }
                <VStack className=' absolute right-1 bottom-0 shadow-lg rounded-full p-1' style={{ backgroundColor: isDark ? "#4D179A" : "#F6F6F6" }}>    
                    <TouchableOpacity  onPress={pickImage}>
                        <Feather name="edit-3" size={18} color={isDark ? "#F6F6F6":"#4D179A" } />
                    </TouchableOpacity>
                </VStack>
            </Avatar>
        </HStack>
        <VStack space="lg" className='px-7 mt-10 flex-1 w-full '>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} >
                        <VStack space="xl" className="mt-2">
                            <FormControl isInvalid={!!nameError} size="md">
                                <VStack space="xs">
                                    <FormControlLabel>
                                        <FormControlLabelText>{t("edt_NameUser")}</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input size="md">
                                        <InputSlot className="pl-3">
                                            <Ionicons name="person-outline" size={20} color="#666" />
                                        </InputSlot>
                                        <InputField placeholder="Votre nom" value={inputName}
                                            onChangeText={(text) => {
                                                setInputName(text);
                                                if (nameError) setNameError('');
                                            }}/>
                                    </Input>
                                    <FormControlHelper>
                                        <FormControlHelperText> {t("edt_NameAlert")} </FormControlHelperText>
                                    </FormControlHelper>
                                    {nameError && (
                                        <FormControlError>
                                            <FormControlErrorIcon as={AlertCircleIcon} />
                                            <FormControlErrorText>{nameError}</FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </VStack>
                            </FormControl>

                            {/* Email */}
                            <FormControl isInvalid={!!emailError} size="md">
                                <VStack space="xs">
                                    <FormControlLabel>
                                        <FormControlLabelText>{t("edt_email")}</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input size="md">
                                        <InputSlot className="pl-3">
                                            <Ionicons name="mail-outline" size={20} color="#666" />
                                        </InputSlot>
                                        <InputField placeholder="email@example.com" value={inputEmail}
                                            onChangeText={(text) => {
                                                setInputEmail(text);
                                                if (emailError) setEmailError('');
                                            }} keyboardType="email-address" autoCapitalize="none"
                                        />
                                    </Input>
                                    <FormControlHelper>
                                        <FormControlHelperText> {t("edt_emailAlert")} </FormControlHelperText>
                                    </FormControlHelper>
                                    {emailError && (
                                        <FormControlError>
                                            <FormControlErrorIcon as={AlertCircleIcon} />
                                            <FormControlErrorText>{emailError}</FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </VStack>
                            </FormControl>

                           
                        </VStack>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            
            <VStack className="items-center">
                <Button variant="solid" onPress={handleSubmit} className='w-1/2 bg-fc-primary'>
                    <ButtonText>{t("edt_save")}</ButtonText>
                </Button>
           </VStack>
        </VStack>

        
      </VStack>    
          
    </SafeAreaView>
  );
}
