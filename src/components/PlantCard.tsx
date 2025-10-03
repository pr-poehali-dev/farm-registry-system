import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

interface PlantCardProps {
  plant: Plant;
  isFavorite: boolean;
  onToggleFavorite: (plantId: number) => void;
  onAddToCart: (plant: Plant) => void;
}

export default function PlantCard({ plant, isFavorite, onToggleFavorite, onAddToCart }: PlantCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={plant.image} 
          alt={plant.name} 
          className="w-full h-64 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={() => onToggleFavorite(plant.id)}
        >
          <Icon 
            name="Heart" 
            size={20} 
            className={isFavorite ? 'fill-red-500 text-red-500' : ''} 
          />
        </Button>
        <Badge className="absolute top-2 left-2">
          {plant.category === 'decorative' ? 'Декоративное' : 'Плодовое'}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle>{plant.name}</CardTitle>
        <CardDescription>{plant.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <span className="text-2xl font-bold text-primary">{plant.price} ₽</span>
        <Button onClick={() => onAddToCart(plant)}>
          <Icon name="ShoppingCart" size={18} className="mr-2" />
          В корзину
        </Button>
      </CardFooter>
    </Card>
  );
}
