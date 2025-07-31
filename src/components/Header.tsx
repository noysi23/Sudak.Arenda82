import React, { useState } from 'react';
import { Menu, X, User, Heart, MessageCircle, Search, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import AddListingModal from './AddListingModal';
import UserProfile from './UserProfile';
import MessagesPanel from './MessagesPanel';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const { user, logout } = useAuth();

  const getUserBalance = (user: any) => {
    if (!user) return 0;
    const users = JSON.parse(localStorage.getItem('sudak_users') || '[]');
    const currentUser = users.find((u: any) => u.id === user.id);
    return currentUser?.balance || 0;
  };

  const handleAddListingClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsAddListingModalOpen(true);
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-sky-600">
              Судак-Аренда
            </div>
          </div>
          
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Главная
              </a>
              {user?.role === 'host' && (
                <button 
                  onClick={handleAddListingClick}
                  className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Разместить объявление
                </button>
              )}
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                О нас
              </a>
            </div>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            {user && (
              <>
                <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  <span>💰</span>
                  <span>{getUserBalance()} монет</span>
                </div>
              <button 
                onClick={() => setIsMessagesOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Mail className="h-5 w-5 text-gray-600" />
              </button>
              </>
            )}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="py-1">
                    <button 
                      onClick={() => setIsProfileOpen(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Мой профиль
                    </button>
                    <button 
                      onClick={() => setIsMessagesOpen(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Мои сообщения
                    </button>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Мои объявления
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Бронирования
                    </a>
                    <hr className="my-1" />
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Войти</span>
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="#" className="text-gray-700 hover:text-sky-600 block px-3 py-2 rounded-md text-base font-medium">
              Главная
            </a>
            {user?.role === 'host' && (
              <button 
                onClick={handleAddListingClick}
                className="text-gray-700 hover:text-sky-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Разместить объявление
              </button>
            )}
            <a href="#" className="text-gray-700 hover:text-sky-600 block px-3 py-2 rounded-md text-base font-medium">
              О нас
            </a>
            {user ? (
              <div className="space-y-1">
                <div className="text-sky-600 px-3 py-2 font-medium">
                  {user.name}
                </div>
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="w-full text-left text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Мой профиль
                </button>
                <button 
                  onClick={() => setIsMessagesOpen(true)}
                  className="w-full text-left text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Мои сообщения
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full text-left bg-sky-600 text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      )}
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <AddListingModal 
        isOpen={isAddListingModalOpen} 
        onClose={() => setIsAddListingModalOpen(false)} 
      />
      
      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
      
      <MessagesPanel 
        isOpen={isMessagesOpen} 
        onClose={() => setIsMessagesOpen(false)} 
      />
    </>
  );
}