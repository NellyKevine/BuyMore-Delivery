import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as Location from 'expo-location';
import type { LocationObject } from 'expo-location';

/**
 * Écran Carte pour le Livreur
 *
 * Fonctionnalités :
 * - Suivi en temps réel de la position du livreur (point bleu)
 * - Affichage de la destination du client (marqueur rouge)
 * - Tracé dynamique de l'itinéraire via OpenRouteService
 * - Mise à jour automatique quand le livreur bouge
 */
export default function MapScreen() {
    // Position actuelle du livreur (via GPS)
    const [driverLocation, setDriverLocation] = useState<LocationObject | null>(null);

    // Position du client (destination) - À remplacer plus tard par les données de l'API Laravel
    const [clientLocation, setClientLocation] = useState<{
        latitude: number;
        longitude: number;
        title: string;
        description: string;
    } | null>(null);

    // Liste des points pour tracer la ligne d'itinéraire
    const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);

    // États d'interface
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Timer pour limiter les appels API
    const routeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clé API OpenRouteService (chargée depuis .env)
    const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_KEY;

    /**
     * 1. Demande permission GPS + suivi en temps réel du livreur
     */
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission GPS refusée. Activez-la dans les paramètres.');
                setIsLoading(false);
                return;
            }

            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000,   // Toutes les 10 secondes
                    distanceInterval: 20,  // Ou tous les 20 mètres
                },
                (newLocation) => {
                    setDriverLocation(newLocation);
                    setIsLoading(false);

                    // Position client par défaut (pour tests) - différente pour voir un vrai itinéraire
                    if (!clientLocation) {
                        setClientLocation({
                            latitude: 3.8480,   // Exemple : un point proche à Yaoundé
                            longitude: 11.5021,
                            title: "Client - Commande #123",
                            description: "Adresse de livraison test",
                        });
                    }
                }
            );

            return () => subscription.remove(); // Nettoyage
        })();
    }, []);

    /**
     * 2. Vérification de la clé API
     */
    useEffect(() => {
        if (!ORS_API_KEY) {
            setErrorMsg("Clé API OpenRouteService manquante dans le fichier .env");
            setIsLoading(false);
        }
    }, []);

    /**
     * 3. Recalcul de l'itinéraire quand le livreur bouge
     */
    useEffect(() => {
        if (!driverLocation || !clientLocation || !ORS_API_KEY) return;

        if (routeTimer.current) clearTimeout(routeTimer.current);

        routeTimer.current = setTimeout(() => {
            fetchRoute(driverLocation, clientLocation);
        }, 3000); // Délai de 3 secondes pour éviter trop d'appels
    }, [driverLocation?.coords?.latitude, driverLocation?.coords?.longitude, clientLocation]);

    /**
     * 4. Appel à OpenRouteService avec la clé JWT dans le header Authorization
     */
    const fetchRoute = async (
        driver: LocationObject,
        client: { latitude: number; longitude: number }
    ) => {
        try {
            const response = await fetch(
                "https://api.openrouteservice.org/v2/directions/driving-car",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${ORS_API_KEY}`,  // Format correct pour clé JWT
                        "Accept": "application/json, application/geo+json",
                    },
                    body: JSON.stringify({
                        coordinates: [
                            [driver.coords.longitude, driver.coords.latitude],  // Départ : livreur
                            [client.longitude, client.latitude],               // Arrivée : client
                        ],
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erreur ORS :", response.status, errorText);
                setRouteCoords([]);
                return;
            }

            const json = await response.json();

            if (!json.routes || json.routes.length === 0) {
                console.warn("Aucun itinéraire trouvé");
                setRouteCoords([]);
                return;
            }

            const encodedGeometry = json.routes[0].geometry;
            const decodedCoords = decodePolyline(encodedGeometry);
            setRouteCoords(decodedCoords);

        } catch (error) {
            console.error("Erreur lors du calcul de l'itinéraire :", error);
            setRouteCoords([]);
        }
    };

    /**
     * 5. Décodage de la polyline encodée renvoyée par ORS
     */
    const decodePolyline = (encoded: string): Array<{ latitude: number; longitude: number }> => {
        const points: Array<{ latitude: number; longitude: number }> = [];
        let index = 0;
        const len = encoded.length;
        let lat = 0;
        let lng = 0;

        while (index < len) {
            let b: number;
            let shift = 0;
            let result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
            lng += dlng;

            points.push({
                latitude: lat / 1e5,
                longitude: lng / 1e5,
            });
        }

        return points;
    };

    /**
     * Rendu de l'écran
     */
    return (
        <VStack style={styles.container}>
            <Text bold size="2xl" className="text-center mt-10">
                Carte des livraisons
            </Text>

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                showsUserLocation={true}
                followsUserLocation={true}
                region={
                    driverLocation
                        ? {
                            latitude: driverLocation.coords.latitude,
                            longitude: driverLocation.coords.longitude,
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.02,
                        }
                        : {
                            latitude: 3.8667, // Yaoundé centre par défaut
                            longitude: 11.5167,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }
                }
            >
                {/* Marqueur livreur */}
                {driverLocation && (
                    <Marker
                        coordinate={{
                            latitude: driverLocation.coords.latitude,
                            longitude: driverLocation.coords.longitude,
                        }}
                        title="Ma position (Livreur)"
                        pinColor="blue"
                    />
                )}

                {/* Marqueur client */}
                {clientLocation && (
                    <Marker
                        coordinate={clientLocation}
                        title={clientLocation.title}
                        description={clientLocation.description}
                        pinColor="red"
                    />
                )}

                {/* Itinéraire */}
                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeColor="#4D179A"
                        strokeWidth={6}
                    />
                )}
            </MapView>

            {/* Chargement */}
            {isLoading && (
                <View style={styles.overlay}>
                    <Text className="text-white text-lg bg-black/50 px-6 py-3 rounded">
                        Chargement de votre position GPS...
                    </Text>
                </View>
            )}

            {/* Erreur */}
            {errorMsg && (
                <View style={styles.overlay}>
                    <Text className="text-red-500 text-center bg-white px-6 py-3 rounded shadow">
                        {errorMsg}
                    </Text>
                </View>
            )}
        </VStack>
    );
}

/**
 * Styles
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
    overlay: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
});