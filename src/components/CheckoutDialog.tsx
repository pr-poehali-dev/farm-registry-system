import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Plant[];
  calculateTotal: () => number;
  onOrderComplete: () => void;
  onToast: (toast: { title: string; description: string; variant?: 'default' | 'destructive' }) => void;
}

const ORDERS_API = 'https://functions.poehali.dev/07df05e5-996a-477f-b3a3-9ace5cab65ce';

export default function CheckoutDialog({
  isOpen,
  onClose,
  cart,
  calculateTotal,
  onOrderComplete,
  onToast
}: CheckoutDialogProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.deliveryAddress) {
      onToast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        delivery_address: formData.deliveryAddress,
        comment: formData.comment,
        items: cart.map(item => ({
          plant_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1
        })),
        total_amount: calculateTotal()
      };

      const response = await fetch(ORDERS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        onToast({
          title: 'Заказ оформлен!',
          description: 'Мы свяжемся с вами в ближайшее время'
        });
        
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          deliveryAddress: '',
          comment: ''
        });
        
        onOrderComplete();
        onClose();
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      onToast({
        title: 'Ошибка',
        description: 'Не удалось оформить заказ. Попробуйте позже',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Оформление заказа</DialogTitle>
          <DialogDescription>
            Заполните данные для доставки
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Ваш заказ</h3>
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.price} ₽</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">Итого:</span>
                <span className="font-bold text-xl text-primary">{calculateTotal()} ₽</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Контактные данные</h3>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="example@mail.ru"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+7 (900) 123-45-67"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Адрес доставки *</Label>
              <Textarea
                id="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={(e) => handleChange('deliveryAddress', e.target.value)}
                placeholder="Город, улица, дом, квартира"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий к заказу</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
                placeholder="Особые пожелания к доставке"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={submitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Оформление...
                </>
              ) : (
                <>
                  <Icon name="ShoppingBag" size={18} className="mr-2" />
                  Оформить заказ
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
