import React from 'react';
import { Search, Calendar, MapPin, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-20">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Найдите идеальное жильё в Судаке
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Квартиры, дома и виллы для незабываемого отдыха у моря
          </p>
        </div>
      </div>
    </section>
  );
}