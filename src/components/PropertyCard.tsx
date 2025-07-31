import React from 'react';
import { Star, MapPin, Wifi, Snowflake, Car, Heart, Eye } from 'lucide-react';

interface PropertyCardProps {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  distanceToSea: string;
  type: string;
  guests: number;
  views?: number;
  onClick?: () => void;
}

export default function PropertyCard({ 
  title, 
  location, 
  price, 
  rating, 
  reviews, 
  images, 
  amenities, 
  distanceToSea,
  type,
  guests,
  views,
  onClick
}: PropertyCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'ac': return <Snowflake className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={images[0]} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
          {distanceToSea} до моря
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{title}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-gray-500">({reviews})</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 mb-3">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600 text-sm">{location}</span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded text-xs font-medium">
            {type}
          </span>
          <span className="text-gray-500 text-sm">• {guests} гостей</span>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          {amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="text-gray-600" title={amenity}>
              {getAmenityIcon(amenity)}
            </div>
          ))}
          {amenities.length > 3 && (
            <span className="text-gray-500 text-sm">+{amenities.length - 3}</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-gray-900">{price.toLocaleString()}₽</span>
            <span className="text-gray-500 text-sm"> / ночь</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Eye className="h-4 w-4" />
            <span>{views || 0}</span>
          </div>
        </div>

        <button className="w-full mt-4 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium">
          Забронировать
        </button>
      </div>
    </div>
  );
}