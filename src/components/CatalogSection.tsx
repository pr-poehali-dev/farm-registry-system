import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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

interface CatalogSectionProps {
  plants: Plant[];
  favorites: number[];
  toggleFavorite: (plantId: number) => void;
  addToCart: (plant: Plant) => void;
  setActiveTab: (tab: string) => void;
}

export default function CatalogSection({ plants, favorites, toggleFavorite, addToCart, setActiveTab }: CatalogSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Каталог растений</h2>
        <Button variant="outline" onClick={() => setActiveTab('home')}>
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Назад
        </Button>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="decorative">Декоративные</TabsTrigger>
          <TabsTrigger value="fruit">Плодовые</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
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
        </TabsContent>
        <TabsContent value="decorative" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.filter(p => p.category === 'decorative').map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                isFavorite={favorites.includes(plant.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="fruit" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.filter(p => p.category === 'fruit').map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                isFavorite={favorites.includes(plant.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}