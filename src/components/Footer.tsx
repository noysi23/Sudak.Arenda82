import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-sky-400 mb-4">
              Судак-Аренда
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Найдите идеальное жильё для отдыха в живописном Судаке. 
              Тысячи проверенных объявлений от частных лиц и агентств.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Для гостей</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Поиск жилья</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Мои бронирования</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Отзывы</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Поддержка</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Для хозяев</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Разместить объявление</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Управление объектами</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Аналитика</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Тарифы</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-sky-400" />
                <span className="text-gray-400">+7 (978) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-sky-400" />
                <span className="text-gray-400">info@sudak-arenda.ru</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-sky-400 mt-0.5" />
                <span className="text-gray-400">г. Судак, Крым</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Судак-Аренда. Все права защищены.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Пользовательское соглашение
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Политика конфиденциальности
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}