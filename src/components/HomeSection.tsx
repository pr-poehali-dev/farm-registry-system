import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import PlantCard from './PlantCard';

interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

interface HomeSectionProps {
  plants: Plant[];
  favorites: number[];
  toggleFavorite: (plantId: number) => void;
  addToCart: (plant: Plant) => void;
  setActiveTab: (tab: string) => void;
}

export default function HomeSection({ plants, favorites, toggleFavorite, addToCart, setActiveTab }: HomeSectionProps) {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/30 p-12 md:p-16">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Живые растения для вашего дома
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Декоративные и плодовые культуры с доставкой. 
            Создайте свой зеленый оазис вместе с нами!
          </p>
          <div className="flex gap-3">
            <Button size="lg" onClick={() => setActiveTab('catalog')}>
              <Icon name="Leaf" size={20} className="mr-2" />
              Смотреть каталог
            </Button>
            <Button size="lg" variant="outline" onClick={() => setActiveTab('contacts')}>
              <Icon name="Phone" size={20} className="mr-2" />
              Связаться с нами
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
          <Icon name="Sprout" size={300} className="text-primary" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold mb-2">Популярные растения</h3>
            <p className="text-muted-foreground">Выбор наших покупателей</p>
          </div>
          <Button variant="link" onClick={() => setActiveTab('catalog')}>
            Все растения
            <Icon name="ArrowRight" size={18} className="ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              isFavorite={favorites.includes(plant.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <Card className="text-center p-6">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Icon name="Truck" size={32} className="text-primary" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Быстрая доставка</h4>
          <p className="text-sm text-muted-foreground">
            Доставим растения в течение 1-2 дней по городу
          </p>
        </Card>
        <Card className="text-center p-6">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Icon name="Shield" size={32} className="text-primary" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Гарантия качества</h4>
          <p className="text-sm text-muted-foreground">
            Все растения здоровые и адаптированные
          </p>
        </Card>
        <Card className="text-center p-6">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Icon name="MessageCircle" size={32} className="text-primary" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Поддержка 24/7</h4>
          <p className="text-sm text-muted-foreground">
            Консультации по уходу за растениями
          </p>
        </Card>
      </section>
    </div>
  );
}