import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function DeliverySection() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Доставка</h2>
      <Card>
        <CardHeader>
          <CardTitle>Условия доставки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
              <Icon name="Truck" size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">По городу</h4>
              <p className="text-sm text-muted-foreground">
                Доставка в течение 1-2 рабочих дней. Стоимость от 300 ₽
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
              <Icon name="MapPin" size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">По России</h4>
              <p className="text-sm text-muted-foreground">
                Курьерская доставка в регионы. Срок 3-7 дней
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
              <Icon name="Gift" size={24} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Бесплатная доставка</h4>
              <p className="text-sm text-muted-foreground">
                При заказе от 5000 ₽ доставка бесплатно
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
