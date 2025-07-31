# Судак-Аренда - Портал аренды жилья

Современная платформа для поиска и размещения объявлений об аренде жилья в Судаке, Крым.

## 🚀 Возможности

- **Поиск жилья** - удобные фильтры по типу, цене, удобствам
- **Размещение объявлений** - для владельцев недвижимости
- **Система сообщений** - общение между арендаторами и владельцами
- **Отзывы и рейтинги** - честные отзывы от гостей
- **Внутренняя валюта** - монеты для оплаты размещения объявлений
- **Календарь заселения** - гибкое управление ценами и доступностью

## 🛠 Технологии

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Иконки**: Lucide React
- **Сборка**: Vite
- **Деплой**: GitHub Pages

## 📦 Установка и запуск

### Локальная разработка

```bash
# Клонировать репозиторий
git clone https://github.com/your-username/sudak-arenda.git
cd sudak-arenda

# Установить зависимости
npm install

# Скопировать переменные окружения
cp .env.example .env

# Запустить в режиме разработки
npm run dev
```

### Сборка для продакшена

```bash
# Сборка для GitHub Pages
npm run build:github

# Обычная сборка
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🌐 Деплой на GitHub Pages

### Автоматический деплой

1. Форкните репозиторий
2. Включите GitHub Pages в настройках репозитория
3. Выберите источник: GitHub Actions
4. Добавьте секреты в Settings → Secrets and variables → Actions:
   - `VITE_API_BASE_URL`
   - `VITE_API_KEY`
5. Пуш в ветку `main` автоматически запустит деплой

### Ручной деплой

```bash
# Установить gh-pages
npm install -g gh-pages

# Деплой
npm run deploy
```

## ⚙️ Конфигурация

### Команда для сборки
```bash
npm run build:github
```

### Директория сборки
```
dist/
```

### API ключ
```
sk_test_sudak_arenda_2025_api_key_demo
```

### Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=https://api.sudak-arenda.ru
VITE_API_KEY=your_api_key_here

# App Configuration
VITE_APP_NAME=Судак-Аренда
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=true

# Payment Configuration
VITE_PAYMENT_ENABLED=true
VITE_COIN_PRICE=1

# Upload Configuration
VITE_MAX_IMAGES=20
VITE_MIN_IMAGES=10
VITE_MAX_FILE_SIZE=5242880

# Contact Information
VITE_SUPPORT_EMAIL=support@sudak-arenda.ru
VITE_SUPPORT_PHONE=+7(978)123-45-67
```

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
├── contexts/           # React контексты
├── config/             # Конфигурация
├── types/              # TypeScript типы
└── utils/              # Утилиты

public/
├── _redirects          # Netlify redirects
└── index.html          # HTML шаблон

.github/
└── workflows/
    └── deploy.yml      # GitHub Actions
```

## 🎯 Основные компоненты

- **Header** - навигация и авторизация
- **PropertyGrid** - сетка объявлений с фильтрами
- **PropertyDetail** - детальная страница объявления
- **AddListingModal** - форма добавления объявления
- **MessengerModal** - система сообщений
- **UserProfile** - личный кабинет пользователя

## 💰 Экономическая модель

- Размещение объявления: **1500 монет**
- Тестовый баланс: **1500 монет** для всех пользователей
- Ограничение: 1 объявление в 3 дня

## 🔐 Роли пользователей

- **Гость** - поиск и бронирование жилья
- **Хозяин** - размещение объявлений и управление

## 📱 Адаптивность

Сайт полностью адаптирован для всех устройств:
- 📱 Мобильные телефоны
- 📱 Планшеты  
- 💻 Десктопы

## 🤝 Вклад в проект

1. Форкните проект
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License.

## 📞 Поддержка

- Email: support@sudak-arenda.ru
- Телефон: +7 (978) 123-45-67
- Telegram: @sudak_arenda_support

---

Сделано с ❤️ для Судака, Крым