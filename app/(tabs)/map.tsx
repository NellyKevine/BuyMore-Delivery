import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as Location from 'expo-location';

/**
 * Écran Carte Livreur
 * - Affiche la position du livreur
 * - Affiche la position du client
 * - Trace l’itinéraire via OpenRouteService
 */
export default function MapScreen() {

    // 📍 Position GPS du livreur
    const [location, setLocation] = useState(null);

    // ❌ Message d’erreur GPS
    const [errorMsg, setErrorMsg] = useState(null);

    // 🟣 Coordonnées de la route ORS
    const [routeCoords, setRouteCoords] = useState([]);

    /**
     * 📦 Adresse client (test Yaoundé)
     */
    const deliveryAddress = {
        latitude: 3.8480,
        longitude: 11.5021,
        title: "Client - Commande #123",
        description: "Adresse de livraison test",
    };

    /**
     *  Clé OpenRouteService
     * À stocker dans .env en production
     */
    const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_KEY || "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjdkOTBkYjZhNDJmMTRiN2U5NGI3OGEyOWViODAzOWVkIiwiaCI6Im11cm11cjY0In0=";

    /**
     *  Demande permission GPS + récupération position
     */
    useEffect(() => {
        (async () => {
            // Demande permission GPS
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission GPS refusée');
                Alert.alert('Permission refusée', 'Impossible d\'accéder à la position');
                return;
            }

            // Récupération position actuelle
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            // Lancement calcul itinéraire
            fetchRoute(currentLocation);
        })();
    }, []);

    /**
     * Calcul de l’itinéraire via OpenRouteService (POST officiel)
     */
    const fetchRoute = async (currentLocation) => {
        try {
            const response = await fetch(
                "https://api.openrouteservice.org/v2/directions/driving-car",
                {
                    method: "POST",
                    headers: {
                        "Authorization": ORS_API_KEY,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        // ⚠️ ORDRE IMPORTANT : longitude, latitude
                        coordinates: [
                            [
                                currentLocation.coords.longitude,
                                currentLocation.coords.latitude,
                            ],
                            [
                                deliveryAddress.longitude,
                                deliveryAddress.latitude,
                            ],
                        ],
                    }),
                }
            );

            const json = await response.json();
            console.log("ORS RESPONSE :", json);

            // Vérification réponse valide
            if (!json.features || json.features.length === 0) {
                Alert.alert("Itinéraire", "Aucun chemin trouvé");
                return;
            }

            // Conversion GeoJSON → Polyline React Native
            const coords = json.features[0].geometry.coordinates.map(
                ([lng, lat]) => ({
                    latitude: lat,
                    longitude: lng,
                })
            );

            setRouteCoords(coords);
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Impossible de tracer l'itinéraire");
        }
    };

    return (
        <VStack style={styles.container}>
            {/* Titre */}
            <Text bold size="2xl" className="text-center mt-10">
                Carte des livraisons
            </Text>

            {/*  Carte */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={
                    location
                        ? {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }
                        : {
                            latitude: 3.8667,
                            longitude: 11.5167,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }
                }
            >

                {/*  Marker livreur */}
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Ma position"
                        description="Livreur"
                        pinColor="blue"
                    />
                )}

                {/*  Marker client */}
                <Marker
                    coordinate={{
                        latitude: deliveryAddress.latitude,
                        longitude: deliveryAddress.longitude,
                    }}
                    title={deliveryAddress.title}
                    description={deliveryAddress.description}
                    pinColor="red"
                />

                {/* Tracé de l’itinéraire */}
                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeColor="#4D179A"
                        strokeWidth={6}
                    />
                )}
            </MapView>

            {/* Message erreur GPS */}
            {errorMsg && (
                <Text className="text-red-500 text-center mt-4">
                    {errorMsg}
                </Text>
            )}
        </VStack>
    );
}

/**
 *  Styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 100,
    },
});
