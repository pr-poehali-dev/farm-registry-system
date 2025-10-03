import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import PlantCard from './PlantCard';
import PlantFormDialog from './PlantFormDialog';
import type { Plant, ToastConfig } from '@/types/admin';

interface PlantsManagementProps {
  plants: Plant[];
  adminPassword: string;
  onPlantsUpdate: (plants: Plant[]) => void;
  onToast: (toast: ToastConfig) => void;
}

const PLANTS_API = 'https://functions.poehali.dev/98192740-b9c9-4e26-8011-0e62528d35d5';

export default function PlantsManagement({ plants, adminPassword, onPlantsUpdate, onToast }: PlantsManagementProps) {
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const name = formData.get('name') as string;
    const priceStr = formData.get('price') as string;
    const category = formData.get('category') as 'decorative' | 'fruit';
    const image = formData.get('image') as string;
    const description = formData.get('description') as string;
    
    const newPlant: any = {};
    
    if (name && name.trim()) newPlant.name = name;
    if (priceStr && !isNaN(parseInt(priceStr))) newPlant.price = parseInt(priceStr);
    if (category) newPlant.category = category;
    if (image && image.trim()) newPlant.image = image;
    if (description && description.trim()) newPlant.description = description;

    try {
      const response = await fetch(PLANTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPassword
        },
        body: JSON.stringify(newPlant)
      });

      if (response.ok) {
        const created = await response.json();
        onPlantsUpdate([...plants, created]);
        setIsAddDialogOpen(false);
        onToast({
          title: 'Успешно',
          description: 'Растение добавлено'
        });
      }
    } catch (error) {
      onToast({
        title: 'Ошибка',
        description: 'Не удалось добавить растение',
        variant: 'destructive'
      });
    }
  };

  const handleUpdatePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlant) return;

    const formData = new FormData(e.target as HTMLFormElement);
    
    const name = formData.get('name') as string;
    const priceStr = formData.get('price') as string;
    const category = formData.get('category') as 'decorative' | 'fruit';
    const image = formData.get('image') as string;
    const description = formData.get('description') as string;
    
    const updatedPlant: any = {
      id: editingPlant.id
    };
    
    if (name && name.trim()) updatedPlant.name = name;
    if (priceStr && !isNaN(parseInt(priceStr))) updatedPlant.price = parseInt(priceStr);
    if (category) updatedPlant.category = category;
    if (image && image.trim()) updatedPlant.image = image;
    if (description && description.trim()) updatedPlant.description = description;

    try {
      const response = await fetch(PLANTS_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPassword
        },
        body: JSON.stringify(updatedPlant)
      });

      if (response.ok) {
        const updated = await response.json();
        onPlantsUpdate(plants.map(p => p.id === updated.id ? updated : p));
        setEditingPlant(null);
        onToast({
          title: 'Успешно',
          description: 'Растение обновлено'
        });
      }
    } catch (error) {
      onToast({
        title: 'Ошибка',
        description: 'Не удалось обновить растение',
        variant: 'destructive'
      });
    }
  };

  const handleDeletePlant = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это растение?')) return;

    try {
      const response = await fetch(`${PLANTS_API}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Password': adminPassword
        }
      });

      if (response.ok) {
        onPlantsUpdate(plants.filter(p => p.id !== id));
        onToast({
          title: 'Успешно',
          description: 'Растение удалено'
        });
      }
    } catch (error) {
      onToast({
        title: 'Ошибка',
        description: 'Не удалось удалить растение',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление растениями</h2>
        <PlantFormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddPlant}
          mode="add"
        />
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить растение
        </Button>
      </div>

      <div className="grid gap-4">
        {plants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onEdit={setEditingPlant}
            onDelete={handleDeletePlant}
          />
        ))}
      </div>

      <PlantFormDialog
        open={!!editingPlant}
        onOpenChange={(open) => !open && setEditingPlant(null)}
        onSubmit={handleUpdatePlant}
        plant={editingPlant}
        mode="edit"
      />
    </div>
  );
}