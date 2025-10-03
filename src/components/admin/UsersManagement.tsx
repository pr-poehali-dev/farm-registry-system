import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { ToastConfig } from '@/types/admin';

interface User {
  id: number;
  email: string;
  balance: number;
  cashback: number;
  created_at: string;
}

interface UsersManagementProps {
  onToast: (toast: ToastConfig) => void;
}

export default function UsersManagement({ onToast }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [balanceInput, setBalanceInput] = useState('');
  const [cashbackInput, setCashbackInput] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const savedAuth = localStorage.getItem('user_auth');
      const mockUsers: User[] = [];
      
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        mockUsers.push({
          id: 1,
          email: authData.userEmail || 'user@example.com',
          balance: authData.balance || 0,
          cashback: authData.cashback || 0,
          created_at: new Date().toISOString()
        });
      }
      
      mockUsers.push(
        {
          id: 2,
          email: 'test@example.com',
          balance: 2000,
          cashback: 150,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          email: 'client@plantshop.ru',
          balance: 500,
          cashback: 25,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      );
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBalance = (user: User) => {
    setEditingUser(user.id);
    setBalanceInput(user.balance.toString());
    setCashbackInput(user.cashback.toString());
  };

  const handleSaveBalance = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newBalance = parseInt(balanceInput) || 0;
      const newCashback = parseInt(cashbackInput) || 0;

      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, balance: newBalance, cashback: newCashback }
          : u
      ));

      setEditingUser(null);
      
      onToast({
        title: 'Сохранено',
        description: 'Баланс пользователя обновлен'
      });
    } catch (error) {
      onToast({
        title: 'Ошибка',
        description: 'Не удалось обновить баланс',
        variant: 'destructive'
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Загрузка пользователей...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление пользователями</h2>
        <Badge variant="outline" className="text-sm">
          Всего: {users.length}
        </Badge>
      </div>

      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск по email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Пользователи не найдены</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="User" size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.email}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {user.id} • Регистрация: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {editingUser === user.id ? (
                    <div className="space-y-3 p-4 bg-accent/50 rounded-lg">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Баланс (₽)</label>
                          <Input
                            type="number"
                            value={balanceInput}
                            onChange={(e) => setBalanceInput(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Кэшбек (₽)</label>
                          <Input
                            type="number"
                            value={cashbackInput}
                            onChange={(e) => setCashbackInput(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveBalance(user.id)}>
                          <Icon name="Check" size={16} className="mr-1" />
                          Сохранить
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>
                          <Icon name="X" size={16} className="mr-1" />
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                          <Icon name="Wallet" size={18} className="text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Баланс</p>
                            <p className="font-semibold">{user.balance} ₽</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                          <Icon name="Gift" size={18} className="text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Кэшбек</p>
                            <p className="font-semibold">{user.cashback} ₽</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEditBalance(user)}>
                        <Icon name="Edit" size={16} className="mr-1" />
                        Изменить
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}