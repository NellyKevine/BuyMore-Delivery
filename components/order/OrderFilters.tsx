// components/order/OrderFilters.tsx - Icônes cohérentes
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Ionicons } from '@expo/vector-icons';

const FILTER_OPTIONS = [
  { id: 'ALL', label: 'Toutes', icon: 'apps' },
  { id: 'in_transit', label: 'Assignée', icon: 'cube' }, // Cube pour "assignée"
  { id: 'delivered', label: 'Livrées', icon: 'checkmark-circle' },
] as const;

type FilterType = 'ALL' | 'in_transit' | 'delivered' ;

interface OrderFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: Record<string, number>;
}

export function OrderFilters({ 
  activeFilter, 
  onFilterChange, 
  counts 
}: OrderFiltersProps) {
  return (
    <View className="bg-white border-b border-gray-200 py-2">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
         className="px-2" // Padding seulement ici
        contentContainerStyle={{
          paddingRight: 18, // Espace à droite pour le scroll
        }}
      >
        <HStack space="xs" >
          {FILTER_OPTIONS.map((filter) => {
            const isActive = activeFilter === filter.id;
            const count = counts[filter.id === 'ALL' ? 'all' : filter.id] || 0;
            
            return (
              <Button
                key={filter.id}
                onPress={() => onFilterChange(filter.id as FilterType)}
                className={`
                  px-3 py-2 rounded-lg flex-row items-center
                  ${isActive 
                    ? 'bg-blue-600' 
                    : 'bg-gray-100'
                  }
                `}
              >
                <Ionicons 
                  name={filter.icon as any} 
                  size={16} 
                  color={isActive ? 'white' : '#6b7280'} 
                  style={{ marginRight: 6 }}
                />
                <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {filter.label}
                </Text>
                {count > 0 && (
                  <View className={`ml-2 px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-700' : 'bg-gray-300'
                  }`}>
                    <Text className={`text-xs ${isActive ? 'text-white' : 'text-gray-700'}`}>
                      {count}
                    </Text>
                  </View>
                )}
              </Button>
            );
          })}
        </HStack>
      </ScrollView>
    </View>
  );
}