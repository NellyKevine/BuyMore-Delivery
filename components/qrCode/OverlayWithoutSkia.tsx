import React from 'react';
import { View, Dimensions, StyleSheet, Platform, Touchable, TouchableOpacity } from 'react-native';
import {  useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HStack } from '../ui/hstack';

const innerDimension = 230;

type childrenProps = {
    isDisplay: boolean;
    hasScanned: boolean;
    setDiplay: (isDisplay: boolean) => void;
    setHasScanned: (hasScanned: boolean) => void;
};

export const OverlayWithoutSkia = ({hasScanned,setHasScanned, isDisplay,setDiplay}:childrenProps) => {

    const router = useRouter();
    const comeBack = () => {
        {hasScanned && setHasScanned(false)}
        router.back(); 
    };
    return (
        <View style={styles.container}>
            <HStack space="xl" style={styles.overlaySectionH} >
                <TouchableOpacity style={{position:'absolute',top:50,left:20,zIndex:10,width:50, height:50}} onPress={comeBack} >
                    <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={{position:'absolute',top:50,right:20,zIndex:10, width:50, height:70}} onPress={()=>setDiplay(!isDisplay)} >
                   {isDisplay?<MaterialCommunityIcons name="flashlight" size={24} color="white" />:<MaterialCommunityIcons name="flashlight-off" size={24} color="white" />}
                </TouchableOpacity>
                
            </HStack>

            <View style={styles.middleSection}>
                <View style={styles.sideOverlay} />
                <View style={styles.transparent} />
                <View style={styles.sideOverlay} />
            </View>

            <View style={styles.overlaySection} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...Platform.OS === 'android' ? { flex: 1 } : StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        width:"100%",
        height:"100%",
    },
    overlaySection: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    overlaySectionH: {
        flex: 1/2,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    middleSection: {
        flexDirection: 'row',
        height: innerDimension,
        borderRadius: 20,
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    transparent: {
        width: innerDimension,
        height: innerDimension,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'gray',
        
    },
});