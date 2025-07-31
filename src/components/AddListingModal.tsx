import React, { useState } from 'react';
import { X, Upload, MapPin, Home, Users, Wifi, Snowflake, Car, Coffee, Waves, TreePine, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const amenityOptions = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'ac', label: 'Кондиционер', icon: Snowflake },
  { id: 'parking', label: 'Парковка', icon: Car },
  { id: 'kitchen', label: 'Кухня', icon: Coffee },
  { id: 'pool', label: 'Бассейн', icon: Waves },
  { id: 'garden', label: 'Сад', icon: TreePine }
];

export default function AddListingModal({ isOpen, onClose }: AddListingModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    location: '',
    price: '',
    guests: '2',
    rooms: '1',
    bathrooms: '1',
    area: '',
    distanceToSea: '',
    amenities: [] as string[],
    images: [] as string[],
    availability: [] as Array<{
      startDate: string;
      endDate: string;
      price: number;
      available: boolean;
    }>
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newAvailability, setNewAvailability] = useState({
    startDate: '',
    endDate: '',
    price: '',
    available: true
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (formData.images.length + files.length > 20) {
        setError('Максимум 20 фотографий');
        return;
      }
      
      // Для демо используем placeholder изображения
      const placeholderImages = [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
        'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg',
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
        'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
        'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
        'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg',
        'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg'
      ];
      
      const newImages = Array.from(files).map((file, index) => {
        return placeholderImages[index % placeholderImages.length];
      });
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddAvailability = () => {
    if (!newAvailability.startDate || !newAvailability.endDate || !newAvailability.price) {
      setError('Заполните все поля периода доступности');
      return;
    }
    
    if (new Date(newAvailability.startDate) >= new Date(newAvailability.endDate)) {
      setError('Дата окончания должна быть позже даты начала');
      return;
    }
    
    const availability = {
      startDate: newAvailability.startDate,
      endDate: newAvailability.endDate,
      price: parseInt(newAvailability.price),
      available: newAvailability.available
    };
    
    setFormData(prev => ({
      ...prev,
      availability: [...prev.availability, availability]
    }));
    
    setNewAvailability({
      startDate: '',
      endDate: '',
      price: '',
      available: true
    });
    setError('');
  };

  const handleRemoveAvailability = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length < 10) {
      setError('Минимум 10 фотографий обязательно');
      return;
    }
    
    // Проверяем баланс пользователя
    const users = JSON.parse(localStorage.getItem('sudak_users') || '[]');
    const currentUser = users.find((u: any) => u.id === user?.id);
    
    if (!currentUser || (currentUser.balance || 0) < 1500) {
      setError('Недостаточно средств на балансе. Необходимо 1500 монет для размещения объявления.');
      return;
    }
    
    // Проверяем ограничение на размещение объявлений
    const userListings = JSON.parse(localStorage.getItem('sudak_listings') || '[]')
      .filter((listing: any) => listing.ownerId === user?.id);
    
    if (userListings.length > 0) {
      const lastListing = userListings[userListings.length - 1];
      const lastListingDate = new Date(lastListing.createdAt);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      if (lastListingDate > threeDaysAgo) {
        const nextAllowedDate = new Date(lastListingDate);
        nextAllowedDate.setDate(nextAllowedDate.getDate() + 3);
        setError(`Вы можете разместить следующее объявление ${nextAllowedDate.toLocaleDateString('ru-RU')}`);
        return;
      }
    }
    
    setIsSubmitting(true);

    // Имитация отправки на сервер
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Сохраняем объявление в localStorage
    const listings = JSON.parse(localStorage.getItem('sudak_listings') || '[]');
    const newListing = {
      id: Date.now(),
      ...formData,
      price: parseInt(formData.price),
      guests: parseInt(formData.guests),
      rooms: parseInt(formData.rooms),
      bathrooms: parseInt(formData.bathrooms),
      area: formData.area ? parseInt(formData.area) : null,
      ownerId: user?.id,
      ownerName: user?.name,
      ownerPhone: user?.phone || '',
      rating: 0,
      reviews: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      images: formData.images,
      availability: formData.availability
    };

    listings.push(newListing);
    localStorage.setItem('sudak_listings', JSON.stringify(listings));

    // Списываем 1500 монет с баланса пользователя
    const updatedUsers = users.map((u: any) => 
      u.id === user?.id ? { ...u, balance: (u.balance || 0) - 1500 } : u
    );
    localStorage.setItem('sudak_users', JSON.stringify(updatedUsers));
    
    // Обновляем баланс текущего пользователя
    const updatedCurrentUser = { ...user, balance: (currentUser.balance || 0) - 1500 };
    localStorage.setItem('sudak_user', JSON.stringify(updatedCurrentUser));

    setIsSubmitting(false);
    setSuccess(true);

    // Обновляем список объявлений на главной странице
    window.dispatchEvent(new Event('listingsUpdated'));

    // Закрываем модал через 2 секунды
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setFormData({
        title: '',
        description: '',
        type: 'apartment',
        location: '',
        price: '',
        guests: '2',
        rooms: '1',
        bathrooms: '1',
        area: '',
        distanceToSea: '',
        amenities: [],
        images: [],
        availability: []
      });
      setNewAvailability({
        startDate: '',
        endDate: '',
        price: '',
        available: true
      });
    }, 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Объявление добавлено!</h3>
          <p className="text-gray-600">Ваше объявление успешно размещено и скоро появится в каталоге.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Разместить объявление</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название объявления *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Например: Уютная квартира с видом на море"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип жилья *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              >
                <option value="apartment">Квартира</option>
                <option value="house">Дом</option>
                <option value="villa">Вилла</option>
                <option value="studio">Студия</option>
                <option value="room">Комната</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Район *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                >
                  <option value="">Выберите район</option>
                  <option value="Центр Судака">Центр Судака</option>
                  <option value="Новый Свет">Новый Свет</option>
                  <option value="Уютное">Уютное</option>
                  <option value="Морское">Морское</option>
                  <option value="Солнечная Долина">Солнечная Долина</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена за ночь (₽) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="3000"
                min="500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество гостей *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                >
                  <option value="1">1 гость</option>
                  <option value="2">2 гостя</option>
                  <option value="3">3 гостя</option>
                  <option value="4">4 гостя</option>
                  <option value="5">5 гостей</option>
                  <option value="6">6 гостей</option>
                  <option value="8">8+ гостей</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество комнат
              </label>
              <select
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="1">1 комната</option>
                <option value="2">2 комнаты</option>
                <option value="3">3 комнаты</option>
                <option value="4">4+ комнат</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Санузлы
              </label>
              <select
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="1">1 санузел</option>
                <option value="2">2 санузла</option>
                <option value="3">3+ санузла</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Расстояние до моря
              </label>
              <select
                name="distanceToSea"
                value={formData.distanceToSea}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">Выберите расстояние</option>
                <option value="30м">30м</option>
                <option value="50м">50м</option>
                <option value="100м">100м</option>
                <option value="200м">200м</option>
                <option value="300м">300м</option>
                <option value="500м">500м</option>
                <option value="1км">1км+</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Опишите ваше жильё: особенности, удобства, что рядом..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Удобства
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenityOptions.map(amenity => (
                  <label
                    key={amenity.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.amenities.includes(amenity.id)
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="sr-only"
                    />
                    <amenity.icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотографии (минимум 10, максимум 20)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Загрузите фотографии вашего жилья</p>
                <p className="text-sm text-gray-500 mb-4">От 10 до 20 фотографий, JPG или PNG</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer"
                >
                  Выбрать файлы
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  Загружено: {formData.images.length}/20
                </p>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                График заселения и цены
              </label>
              
              <div className="border rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-3">Добавить период доступности</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Дата заезда</label>
                    <input
                      type="date"
                      value={newAvailability.startDate}
                      onChange={(e) => setNewAvailability(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Дата выезда</label>
                    <input
                      type="date"
                      value={newAvailability.endDate}
                      onChange={(e) => setNewAvailability(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      min={newAvailability.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Цена за ночь (₽)</label>
                    <input
                      type="number"
                      value={newAvailability.price}
                      onChange={(e) => setNewAvailability(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="3000"
                      min="500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddAvailability}
                      className="w-full bg-sky-600 text-white py-2 rounded text-sm hover:bg-sky-700"
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              </div>

              {formData.availability.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Добавленные периоды:</h4>
                  {formData.availability.map((period, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="text-sm">
                        <span className="font-medium">
                          {new Date(period.startDate).toLocaleDateString('ru-RU')} - {new Date(period.endDate).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="ml-2 text-gray-600">
                          {period.price.toLocaleString()}₽/ночь
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAvailability(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Размещение...' : 'Разместить объявление'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}