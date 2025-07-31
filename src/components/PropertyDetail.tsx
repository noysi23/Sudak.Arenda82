import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Users, Home, Wifi, Snowflake, Car, Coffee, Waves, TreePine, Phone, Mail, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MessengerModal from './MessengerModal';

interface PropertyDetailProps {
  propertyId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function PropertyDetail({ propertyId, isOpen, onClose }: PropertyDetailProps) {
  const [property, setProperty] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && propertyId) {
      // Загружаем данные объявления
      const listings = JSON.parse(localStorage.getItem('sudak_listings') || '[]');
      const foundProperty = listings.find((p: any) => p.id === propertyId);
      
      if (foundProperty) {
        // Увеличиваем счетчик просмотров
        const updatedListings = listings.map((p: any) => 
          p.id === propertyId ? { ...p, views: (p.views || 0) + 1 } : p
        );
        localStorage.setItem('sudak_listings', JSON.stringify(updatedListings));
        
        setProperty({ ...foundProperty, views: (foundProperty.views || 0) + 1 });
      }

      // Загружаем отзывы
      const savedReviews = JSON.parse(localStorage.getItem(`reviews_${propertyId}`) || '[]');
      setReviews(savedReviews);
    }
  }, [propertyId, isOpen]);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-5 w-5" />;
      case 'ac': return <Snowflake className="h-5 w-5" />;
      case 'parking': return <Car className="h-5 w-5" />;
      case 'kitchen': return <Coffee className="h-5 w-5" />;
      case 'pool': return <Waves className="h-5 w-5" />;
      case 'garden': return <TreePine className="h-5 w-5" />;
      default: return null;
    }
  };

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return 'Wi-Fi';
      case 'ac': return 'Кондиционер';
      case 'parking': return 'Парковка';
      case 'kitchen': return 'Кухня';
      case 'pool': return 'Бассейн';
      case 'garden': return 'Сад';
      default: return amenity;
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReview.comment.trim()) return;

    setIsSubmittingReview(true);

    const review: Review = {
      id: Date.now(),
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('ru-RU')
    };

    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${propertyId}`, JSON.stringify(updatedReviews));

    // Обновляем рейтинг объявления
    const listings = JSON.parse(localStorage.getItem('sudak_listings') || '[]');
    const updatedListings = listings.map((p: any) => {
      if (p.id === propertyId) {
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / updatedReviews.length;
        return {
          ...p,
          rating: Math.round(avgRating * 10) / 10,
          reviews: updatedReviews.length
        };
      }
      return p;
    });
    localStorage.setItem('sudak_listings', JSON.stringify(updatedListings));
    setProperty({ ...property, rating: Math.round((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length) * 10) / 10, reviews: updatedReviews.length });

    setNewReview({ rating: 5, comment: '' });
    setIsSubmittingReview(false);
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Изображения */}
          <div className="mb-6">
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Основная информация */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
                      {property.type}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{property.guests} гостей</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{property.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-500">({property.reviews} отзывов)</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {property.price?.toLocaleString()}₽ <span className="text-lg font-normal text-gray-500">/ ночь</span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {property.description}
                </p>

                {/* Удобства */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Удобства</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {property.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          {getAmenityIcon(amenity)}
                          <span>{getAmenityLabel(amenity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {property.distanceToSea && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <Waves className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Расстояние до моря: {property.distanceToSea}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Отзывы */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Отзывы ({reviews.length})</h3>
                
                {/* Форма добавления отзыва */}
                {user && (
                  <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Оставить отзыв</h4>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Оценка
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`p-1 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Комментарий
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        rows={3}
                        placeholder="Поделитесь впечатлениями о проживании..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Отправка...' : 'Отправить отзыв'}
                    </button>
                  </form>
                )}

                {/* Список отзывов */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.userName}</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Пока нет отзывов</p>
                  )}
                </div>
              </div>
            </div>

            {/* Боковая панель с контактами */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Контакты владельца</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 font-medium">
                        {property.ownerName?.charAt(0) || 'В'}
                      </span>
                    </div>
                    <span className="font-medium">{property.ownerName || 'Владелец'}</span>
                  </div>
                  
                  {property.ownerPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <a 
                        href={`tel:${property.ownerPhone}`}
                        className="text-sky-600 hover:text-sky-700"
                      >
                        {property.ownerPhone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium">
                    Забронировать
                  </button>
                  
                  {property.availability && property.availability.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Доступные даты:</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {property.availability.map((period: any, index: number) => (
                          <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                            <div className="font-medium">
                              {new Date(period.startDate).toLocaleDateString('ru-RU')} - {new Date(period.endDate).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="text-sky-600">
                              {period.price.toLocaleString()}₽/ночь
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setIsMessengerOpen(true)}
                    className="w-full border border-sky-600 text-sky-600 py-3 rounded-lg hover:bg-sky-50 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Написать сообщение</span>
                  </button>
                  
                  {property.ownerPhone && (
                    <a
                      href={`tel:${property.ownerPhone}`}
                      className="w-full border border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Позвонить</span>
                    </a>
                  )}
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  <p>Свяжитесь с владельцем для уточнения деталей бронирования и получения дополнительной информации.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {property && (
        <MessengerModal
          isOpen={isMessengerOpen}
          onClose={() => setIsMessengerOpen(false)}
          recipientId={property.ownerId}
          recipientName={property.ownerName}
          propertyTitle={property.title}
        />
      )}
    </div>
  );
}