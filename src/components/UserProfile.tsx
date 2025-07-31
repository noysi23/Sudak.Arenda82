import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Eye, Star, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user } = useAuth();
  const [userListings, setUserListings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings' | 'profile'>('listings');

  const getUserBalance = (user: any) => {
    if (!user) return 0;
    const users = JSON.parse(localStorage.getItem('sudak_users') || '[]');
    const currentUser = users.find((u: any) => u.id === user.id);
    return currentUser?.balance || 0;
  };

  useEffect(() => {
    if (isOpen && user) {
      // Загружаем объявления пользователя
      const allListings = JSON.parse(localStorage.getItem('sudak_listings') || '[]');
      const myListings = allListings.filter((listing: any) => listing.ownerId === user.id);
      setUserListings(myListings);
    }
  }, [isOpen, user]);

  const handleDeleteListing = (listingId: number) => {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
      const allListings = JSON.parse(localStorage.getItem('sudak_listings') || '[]');
      const updatedListings = allListings.filter((listing: any) => listing.id !== listingId);
      localStorage.setItem('sudak_listings', JSON.stringify(updatedListings));
      setUserListings(userListings.filter(listing => listing.id !== listingId));
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Личный кабинет</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex">
          {/* Боковое меню */}
          <div className="w-64 bg-gray-50 p-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-sky-600">
                  {user.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full">
                {user.role === 'host' ? 'Хозяин' : 'Гость'}
              </span>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('listings')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'listings' ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'
                }`}
              >
                Мои объявления
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'bookings' ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'
                }`}
              >
                Бронирования
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-100'
                }`}
              >
                Настройки профиля
              </button>
            </nav>
          </div>

          {/* Основной контент */}
          <div className="flex-1 p-6">
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Мои объявления</h3>
                  <span className="text-gray-600">{userListings.length} объявлений</span>
                </div>

                {userListings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Нет объявлений</h4>
                    <p className="text-gray-600 mb-4">Вы еще не разместили ни одного объявления</p>
                    <button 
                      onClick={onClose}
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
                    >
                      Разместить объявление
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userListings.map((listing) => (
                      <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{listing.title}</h4>
                            <p className="text-gray-600 mb-2">{listing.location}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span>{listing.type}</span>
                              <span>•</span>
                              <span>{listing.guests} гостей</span>
                              <span>•</span>
                              <span className="font-medium text-gray-900">{listing.price?.toLocaleString()}₽/ночь</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{listing.rating || 0}</span>
                              <span className="text-sm text-gray-500">({listing.reviews || 0} отзывов)</span>
                              <span className="text-sm text-gray-500">• {listing.views || 0} просмотров</span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteListing(listing.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Бронирования</h3>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Нет бронирований</h4>
                  <p className="text-gray-600">У вас пока нет активных бронирований</p>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Настройки профиля</h3>
                <ProfileSettings user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user }: { user: any }) {
  const [phone, setPhone] = useState(user.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSavePhone = async () => {
    setIsSaving(true);
    
    // Обновляем телефон в localStorage
    const users = JSON.parse(localStorage.getItem('sudak_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, phone } : u
    );
    localStorage.setItem('sudak_users', JSON.stringify(updatedUsers));
    
    // Обновляем текущего пользователя
    const updatedUser = { ...user, phone };
    localStorage.setItem('sudak_user', JSON.stringify(updatedUser));
    
    // Обновляем объявления пользователя
    const listings = JSON.parse(localStorage.getItem('sudak_listings') || '[]');
    const updatedListings = listings.map((listing: any) => 
      listing.ownerId === user.id ? { ...listing, ownerPhone: phone } : listing
    );
    localStorage.setItem('sudak_listings', JSON.stringify(updatedListings));
    
    setIsSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Имя
        </label>
        <input
          type="text"
          value={user.name}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-50"
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={user.email}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-50"
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (978) 123-45-67"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Этот номер будет отображаться в ваших объявлениях
        </p>
      </div>
      
      {success && (
        <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
          Данные успешно сохранены!
        </div>
      )}
      
      <button 
        onClick={handleSavePhone}
        disabled={isSaving}
        className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50"
      >
        {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </div>
  );
}