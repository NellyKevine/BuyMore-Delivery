import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import{Platform, TouchableOpacity, View, Linking} from "react-native";
import {Text} from "@/components/ui/text";
import {s} from "@/components/style/qrCodeStyle"
import {useCameraPermissions, CameraView} from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from 'react-native';
import { OverlayWithoutSkia } from "@/components/qrCode/OverlayWithoutSkia";
import { useFocusEffect, useRouter } from "expo-router";


export default function QrCode(){

    const router = useRouter();
        
   const [dataScanned, setDataScanned] = React.useState(null); // Pour stocker les donnees scannees
    const [isAllume, setAllume] = React.useState(false); // Pour allumer ou eteindre la lampe torche

    const [hasScanned, setHasScanned] = React.useState(false);

  
  

    const qrcodeData = (data:any) =>{
        
        if(data.startsWith("http") || data.startsWith("https")){ //Pour verifier si le lien scanne est un lien web
            setTimeout(() => {
                Linking.openURL(data).catch(err => console.log("Error opening URL: ",err)); //Pour ouvrir le lien scanne dans le navigateur
                setHasScanned(false); // Pour permettre un nouveau scan
                router.back();
            },500);
            
            
        }else{
            setDataScanned(data); //Pour stocker les datas
            
            console.log("Qr Code data",data);
        }
    }
 
    
    return (
        <SafeAreaView style={s.container} edges={['top']}> 
            {Platform.OS === 'android' && <StatusBar hidden />}
            <CameraView 
                style={StyleSheet.absoluteFillObject}
                facing="back" // pour utiliser la camera arriere et non avant
                onBarcodeScanned={({data})=> { //On scanne le code et on recupere data qui represente le code qui a ete scanne
                    if (hasScanned) return;

                    setHasScanned(true); 

                    if(data){
                        qrcodeData(data)
                    }
                    
                    //alert(`Code Qr scanne: ${data}`);
                }}

                enableTorch={isAllume}
            />
            <OverlayWithoutSkia hasScanned={hasScanned} setHasScanned={setHasScanned} isDisplay={isAllume} setDiplay={setAllume}/>
            <View style={s.scanInstructionsContainer}>
				<Text style={s.scanInstructionsText} className={"text-white text-center text-lg font-medium"}>
					Placez le QR code dans le cadre pour scanner
				</Text>
			</View>
        </SafeAreaView>
    );

}