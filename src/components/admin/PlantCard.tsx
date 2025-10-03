import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  onEdit: (plant: Plant) => void;
  onDelete: (id: number) => void;
}

export default function PlantCard({ plant, onEdit, onDelete }: PlantCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img src={plant.image} alt={plant.name} className="w-24 h-24 rounded object-cover" />
          <div className="flex-1">
            <h3 className="font-bold text-lg">{plant.name}</h3>
            <p className="text-sm text-muted-foreground">{plant.description}</p>
            <div className="flex gap-4 mt-2">
              <span className="text-sm">
                <strong>Цена:</strong> {plant.price} ₽
              </span>
              <span className="text-sm">
                <strong>Категория:</strong> {plant.category === 'decorative' ? 'Декоративное' : 'Плодовое'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(plant)}>
              <Icon name="Edit" size={16} className="mr-2" />
              Изменить
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(plant.id)}>
              <Icon name="Trash2" size={16} className="mr-2" />
              Удалить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
