import React from 'react';
import { Shield, Star, MessageCircle, MapPin, Clock, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Безопасность",
    description: "Все объявления проходят модерацию. Ваша безопасность - наш приоритет."
  },
  {
    icon: Star,
    title: "Рейтинги и отзывы",
    description: "Честные отзывы от реальных гостей помогут сделать правильный выбор."
  },
  {
    icon: MessageCircle,
    title: "Поддержка 24/7",
    description: "Наша команда всегда готова помочь вам в любое время суток."
  },
  {
    icon: MapPin,
    title: "Лучшие локации",
    description: "От центра города до уединенных бухт - выберите идеальное место."
  },
  {
    icon: Clock,
    title: "Мгновенное бронирование",
    description: "Забронируйте жильё всего за несколько кликов без ожидания."
  },
  {
    icon: CreditCard,
    title: "Безопасные платежи",
    description: "Защищенные платежи и возврат средств при отмене бронирования."
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Почему выбирают Судак-Аренда
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Мы делаем поиск и бронирование жилья максимально простым и безопасным
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 text-sky-600 rounded-full mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}