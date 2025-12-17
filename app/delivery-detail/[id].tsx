import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function DeliveryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Détail de la livraison #{id}</Text>
      {/* Ton contenu Gluestack ici */}
    </View>
  );
}