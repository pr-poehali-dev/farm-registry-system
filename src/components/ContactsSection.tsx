import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export default function ContactsSection() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Контакты</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Свяжитесь с нами</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon name="Phone" size={20} className="text-primary" />
              <span>+7 (900) 123-45-67</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Mail" size={20} className="text-primary" />
              <span>info@plantshop.ru</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="MapPin" size={20} className="text-primary" />
              <span>г. Москва, ул. Садовая, д. 15</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Clock" size={20} className="text-primary" />
              <span>Пн-Вс: 9:00 - 21:00</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Напишите нам</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Имя</Label>
                <Input id="contact-name" placeholder="Ваше имя" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Сообщение</Label>
                <Input id="contact-message" placeholder="Ваше сообщение" />
              </div>
              <Button type="submit" className="w-full">Отправить</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
