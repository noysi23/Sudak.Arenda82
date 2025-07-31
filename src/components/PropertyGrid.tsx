import React from 'react';
import PropertyCard from './PropertyCard';

import { Home } from 'lucide-react';

interface PropertyGridProps {
  onPropertyClick?: (propertyId: number) => void;
  filters?: any;
}

export default function PropertyGrid({ onPropertyClick, filters }: PropertyGridProps) {
  const [properties, setProperties] = React.useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Загружаем объявления из localStorage
    const savedListings = JSON.parse(localStorage.getItem('sudak_listings') || '[]');

    setProperties(savedListings);
  }, []);

  React.useEffect(() => {
    let filtered = [...properties];

    if (filters) {
      // Фильтр по типу
      if (filters.type) {
        filtered = filtered.filter(property => property.type === filters.type);
      }

      // Фильтр по цене
      if (filters.priceMin) {
        filtered = filtered.filter(property => property.price >= parseInt(filters.priceMin));
      }
      if (filters.priceMax) {
        filtered = filtered.filter(property => property.price <= parseInt(filters.priceMax));
      }

      // Фильтр по удобствам
      if (filters.amenities && filters.amenities.length > 0) {
        filtered = filtered.filter(property => 
          filters.amenities.every((amenity: string) => property.amenities?.includes(amenity))
        );
      }

      // Фильтр по расстоянию до моря
      if (filters.distanceToSea) {
        filtered = filtered.filter(property => {
          const distance = property.distanceToSea;
          switch (filters.distanceToSea) {
            case 'До 100м':
              return distance && (distance.includes('30м') || distance.includes('50м') || distance.includes('100м'));
            case 'До 300м':
              return distance && (distance.includes('200м') || distance.includes('300м'));
            case 'До 500м':
              return distance && distance.includes('500м');
            case 'Более 500м':
              return distance && distance.includes('1км');
            default:
              return true;
          }
        });
      }
    }

    setFilteredProperties(filtered);
  }, [properties, filters]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Доступные предложения
          </h2>
          <span className="text-gray-600">
            Найдено {filteredProperties.length} вариантов
          </span>
        </div>
        
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                {...property}
                onClick={() => onPropertyClick?.(property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Объявления не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </div>
        )}

        {filteredProperties.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium">
              Показать ещё
            </button>
          </div>
        )}
      </div>
    </section>
  );
}