import React, { useState } from 'react';
import { Filter, Home, Building, TreePine, Car, Wifi, Snowflake, Waves, Coffee } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    priceMin: '',
    priceMax: '',
    amenities: [] as string[],
    distanceToSea: ''
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const handleTypeFilter = (type: string) => {
    handleFilterChange('type', filters.type === type ? '' : type);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <button 
              onClick={() => handleTypeFilter('')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                !filters.type ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Все типы</span>
            </button>
            <button 
              onClick={() => handleTypeFilter('Квартира')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                filters.type === 'Квартира' ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Квартиры</span>
            </button>
            <button 
              onClick={() => handleTypeFilter('Дом')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                filters.type === 'Дом' ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Дома</span>
            </button>
            <button 
              onClick={() => handleTypeFilter('Вилла')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                filters.type === 'Вилла' ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'
              }`}
            >
              <TreePine className="h-4 w-4" />
              <span>Виллы</span>
            </button>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Фильтры</span>
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 p-6 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Цена за ночь (₽)</h3>
                <div className="flex items-center space-x-4">
                  <input 
                    type="number" 
                    placeholder="От" 
                    className="w-full p-2 border rounded-lg"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="До" 
                    className="w-full p-2 border rounded-lg"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Удобства</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      checked={filters.amenities.includes('wifi')}
                      onChange={() => handleAmenityToggle('wifi')}
                    />
                    <Wifi className="h-4 w-4 text-gray-600" />
                    <span>Wi-Fi</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      checked={filters.amenities.includes('ac')}
                      onChange={() => handleAmenityToggle('ac')}
                    />
                    <Snowflake className="h-4 w-4 text-gray-600" />
                    <span>Кондиционер</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      checked={filters.amenities.includes('parking')}
                      onChange={() => handleAmenityToggle('parking')}
                    />
                    <Car className="h-4 w-4 text-gray-600" />
                    <span>Парковка</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      checked={filters.amenities.includes('kitchen')}
                      onChange={() => handleAmenityToggle('kitchen')}
                    />
                    <Coffee className="h-4 w-4 text-gray-600" />
                    <span>Кухня</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Расстояние до моря</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="distance" 
                      checked={filters.distanceToSea === 'До 100м'}
                      onChange={() => handleFilterChange('distanceToSea', 'До 100м')}
                    />
                    <span>До 100 м</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="distance" 
                      checked={filters.distanceToSea === 'До 300м'}
                      onChange={() => handleFilterChange('distanceToSea', 'До 300м')}
                    />
                    <span>До 300 м</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="distance" 
                      checked={filters.distanceToSea === 'До 500м'}
                      onChange={() => handleFilterChange('distanceToSea', 'До 500м')}
                    />
                    <span>До 500 м</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="distance" 
                      checked={filters.distanceToSea === 'Более 500м'}
                      onChange={() => handleFilterChange('distanceToSea', 'Более 500м')}
                    />
                    <span>Более 500 м</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Отмена
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Применить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}