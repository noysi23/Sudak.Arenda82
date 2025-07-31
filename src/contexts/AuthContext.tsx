import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'guest' | 'host';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'guest' | 'host') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохраненного пользователя при загрузке
    const savedUser = localStorage.getItem('sudak_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Выдаем тестовые 1500 монет всем существующим пользователям
    const users = JSON.parse(localStorage.getItem('sudak_users') || '[]');
    const updatedUsers = users.map((u: any) => ({
      ...u,
      balance: u.balance !== undefined ? u.balance : 1500
    }));
    if (updatedUsers.length > 0) {
      localStorage.setItem('sudak_users', JSON.stringify(updatedUsers));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Проверяем существующих пользователей
    const users = JSON.parse(localStorage.getItem('sudak_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (existingUser) {
      const userData = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        phone: existingUser.phone,
        avatar: existingUser.avatar
      };
      setUser(userData);
      localStorage.setItem('sudak_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string, role: 'guest' | 'host'): Promise<boolean> => {
    setIsLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Проверяем существующих пользователей
    const users = JSON.parse(localStorage.getItem('sudak_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      return false; // Пользователь уже существует
    }
    
    // Создаем нового пользователя
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('sudak_users', JSON.stringify(users));
    
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };
    
    setUser(userData);
    localStorage.setItem('sudak_user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sudak_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}