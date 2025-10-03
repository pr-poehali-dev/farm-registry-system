import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface OrderItem {
  plant_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  comment: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  created_at: string;
}

interface MyOrdersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const ORDERS_API = 'https://functions.poehali.dev/07df05e5-996a-477f-b3a3-9ace5cab65ce';

const statusLabels: Record<Order['status'], string> = {
  pending: 'Ожидает обработки',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен'
};

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function MyOrdersDialog({ isOpen, onClose, userEmail }: MyOrdersDialogProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (isOpen && userEmail) {
      loadOrders();
    }
  }, [isOpen, userEmail]);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, sortOrder]);

  const applyFilters = () => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(result);
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setSortOrder('newest');
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ORDERS_API}?email=${encodeURIComponent(userEmail)}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Мои заказы</DialogTitle>
          <DialogDescription>
            История ваших покупок
          </DialogDescription>
        </DialogHeader>

        {!loading && orders.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-b pb-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Статус заказа</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидает обработки</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="shipped">Отправлен</SelectItem>
                  <SelectItem value="delivered">Доставлен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Сортировка по дате</label>
              <Select value={sortOrder} onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center gap-2">
                      <Icon name="ArrowDown" size={16} />
                      Сначала новые
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center gap-2">
                      <Icon name="ArrowUp" size={16} />
                      Сначала старые
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(statusFilter !== 'all' || sortOrder !== 'newest') && (
              <div className="flex items-end">
                <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
                  <Icon name="X" size={16} className="mr-2" />
                  Сбросить
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка заказов...</p>
            </div>
          ) : filteredOrders.length === 0 && orders.length > 0 ? (
            <div className="text-center py-12">
              <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Заказы не найдены</h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить фильтры
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">У вас пока нет заказов</h3>
              <p className="text-muted-foreground">
                Оформите первый заказ и он появится здесь
              </p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">Заказ #{order.id}</h3>
                          <Badge className={statusColors[order.status]}>
                            {statusLabels[order.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Сумма заказа</p>
                        <p className="font-bold text-xl text-primary">{order.total_amount} ₽</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-3">Товары:</p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Icon name="Sprout" size={16} className="text-primary" />
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm text-muted-foreground">× {item.quantity}</span>
                            </div>
                            <span className="text-sm font-medium">{item.price * item.quantity} ₽</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Адрес доставки:</p>
                      <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                      
                      {order.comment && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Комментарий:</p>
                          <p className="text-sm text-muted-foreground">{order.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}