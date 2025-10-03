import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Plant } from '@/types/admin';

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
              placeholder="Например: Монстера"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-price`}>Цена (₽)</Label>
            <Input 
              id={`${mode}-price`} 
              name="price" 
              type="number" 
              defaultValue={plant?.price || ''} 
              placeholder="1000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-category`}>Категория</Label>
            <Select name="category" defaultValue={plant?.category || 'decorative'}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="decorative">Декоративное</SelectItem>
                <SelectItem value="fruit">Плодовое</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-image`}>URL изображения (необязательно)</Label>
            <Input 
              id={`${mode}-image`} 
              name="image" 
              defaultValue={plant?.image || ''} 
              placeholder="Оставьте пустым для автопоиска"
            />
            <p className="text-xs text-muted-foreground">
              💡 Если не указать - фото подберётся автоматически по названию
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-description`}>Описание</Label>
            <Textarea 
              id={`${mode}-description`} 
              name="description" 
              defaultValue={plant?.description || ''} 
              placeholder="Краткое описание растения"
              rows={3}
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