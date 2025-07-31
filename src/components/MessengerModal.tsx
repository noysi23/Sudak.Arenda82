import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  propertyTitle?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export default function MessengerModal({ 
  isOpen, 
  onClose, 
  recipientId, 
  recipientName,
  propertyTitle 
}: MessengerModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = [user?.id, recipientId].sort().join('-');

  useEffect(() => {
    if (isOpen && user) {
      loadMessages();
    }
  }, [isOpen, user, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const savedMessages = JSON.parse(localStorage.getItem(`chat_${chatId}`) || '[]');
    setMessages(savedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));

    setNewMessage('');
    setIsLoading(false);

    // Имитация ответа (для демо)
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: recipientId,
          senderName: recipientName,
          text: 'Спасибо за сообщение! Отвечу в ближайшее время.',
          timestamp: new Date().toISOString()
        };
        const newMessages = [...updatedMessages, autoReply];
        setMessages(newMessages);
        localStorage.setItem(`chat_${chatId}`, JSON.stringify(newMessages));
      }, 2000);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full h-[600px] flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{recipientName}</h3>
              {propertyTitle && (
                <p className="text-sm text-gray-500 truncate max-w-48">{propertyTitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Начните общение!</p>
              <p className="text-sm mt-1">Напишите первое сообщение</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.senderId === user.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === user.id ? 'text-sky-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Форма отправки */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Напишите сообщение..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className="bg-sky-600 text-white p-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}