import React, { useState, useEffect } from 'react';
import { X, MessageCircle, User, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MessengerModal from './MessengerModal';

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  propertyTitle?: string;
}

export default function MessagesPanel({ isOpen, onClose }: MessagesPanelProps) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadChats();
    }
  }, [isOpen, user]);

  const loadChats = () => {
    if (!user) return;

    const allChats: Chat[] = [];
    
    // Получаем все чаты пользователя
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('chat_') && key.includes(user.id)) {
        const messages = JSON.parse(localStorage.getItem(key) || '[]');
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          const otherUserId = key.replace('chat_', '').split('-').find(id => id !== user.id);
          
          if (otherUserId) {
            // Получаем информацию о собеседнике
            const users = JSON.parse(localStorage.getItem('sudak_users') || '[]');
            const participant = users.find((u: any) => u.id === otherUserId);
            
            if (participant) {
              allChats.push({
                id: key.replace('chat_', ''),
                participantId: otherUserId,
                participantName: participant.name,
                lastMessage: lastMessage.text,
                lastMessageTime: lastMessage.timestamp,
                unreadCount: messages.filter((msg: any) => msg.senderId !== user.id && !msg.read).length,
                propertyTitle: getPropertyTitle(messages)
              });
            }
          }
        }
      }
    }

    // Сортируем по времени последнего сообщения
    allChats.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
    setChats(allChats);
  };

  const getPropertyTitle = (messages: any[]) => {
    // Ищем упоминание объявления в первых сообщениях
    const firstMessage = messages[0];
    if (firstMessage?.propertyTitle) {
      return firstMessage.propertyTitle;
    }
    return undefined;
  };

  const filteredChats = chats.filter(chat =>
    chat.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 дней
      return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Мои сообщения</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по именам или объявлениям..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {chats.length === 0 ? 'Нет сообщений' : 'Ничего не найдено'}
                </h3>
                <p className="text-gray-600">
                  {chats.length === 0 
                    ? 'Здесь будут отображаться ваши диалоги с арендодателями и арендаторами'
                    : 'Попробуйте изменить поисковый запрос'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {chat.participantName}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(chat.lastMessageTime)}
                            </span>
                            {chat.unreadCount > 0 && (
                              <span className="bg-sky-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        {chat.propertyTitle && (
                          <p className="text-xs text-sky-600 mb-1 truncate">
                            {chat.propertyTitle}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedChat && (
        <MessengerModal
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          recipientId={chats.find(c => c.id === selectedChat)?.participantId || ''}
          recipientName={chats.find(c => c.id === selectedChat)?.participantName || ''}
          propertyTitle={chats.find(c => c.id === selectedChat)?.propertyTitle}
        />
      )}
    </>
  );
}