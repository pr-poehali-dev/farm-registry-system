import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

interface PlantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  plant?: Plant | null;
  mode: 'add' | 'edit';
}

export default function PlantFormDialog({ open, onOpenChange, onSubmit, plant, mode }: PlantFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Новое растение' : 'Редактировать растение'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Заполните данные о растении' : 'Измените данные растения'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Название</Label>
            <Input 
              id={`${mode}-name`} 
              name="name" 
              defaultValue={plant?.name || ''} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-price`}>Цена (₽)</Label>
            <Input 
              id={`${mode}-price`} 
              name="price" 
              type="number" 
              defaultValue={plant?.price || ''} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-category`}>Категория</Label>
            <Select name="category" defaultValue={plant?.category || 'decorative'} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="decorative">Декоративное</SelectItem>
                <SelectItem value="fruit">Плодовое</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-image`}>URL изображения</Label>
            <Input 
              id={`${mode}-image`} 
              name="image" 
              defaultValue={plant?.image || ''} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-description`}>Описание</Label>
            <Textarea 
              id={`${mode}-description`} 
              name="description" 
              defaultValue={plant?.description || ''} 
              required 
            />
          </div>
          <DialogFooter>
            <Button type="submit">{mode === 'add' ? 'Добавить' : 'Сохранить'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
