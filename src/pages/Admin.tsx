import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const PLANTS_API = 'https://functions.poehali.dev/98192740-b9c9-4e26-8011-0e62528d35d5';
const SETTINGS_API = 'https://functions.poehali.dev/2cc392a6-5375-4f6d-aead-d8a3ac112c4c';

interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

interface Settings {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [settings, setSettings] = useState<Settings>({
    phone: '',
    email: '',
    address: '',
    working_hours: ''
  });
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(SETTINGS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
        setAdminPassword(password);
        loadData(password);
        toast({
          title: 'Вход выполнен',
          description: 'Добро пожаловать в админ-панель'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Неверный пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти в систему',
        variant: 'destructive'
      });
    }
  };

  const loadData = async (pwd: string) => {
    try {
      const [plantsRes, settingsRes] = await Promise.all([
        fetch(PLANTS_API),
        fetch(SETTINGS_API)
      ]);

      const plantsData = await plantsRes.json();
      const settingsData = await settingsRes.json();

      setPlants(plantsData);
      setSettings(settingsData);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    }
  };

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newPlant = {
      name: formData.get('name') as string,
      price: parseInt(formData.get('price') as string),
      category: formData.get('category') as 'decorative' | 'fruit',
      image: formData.get('image') as string,
      description: formData.get('description') as string
    };

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
        setPlants([...plants, created]);
        setIsAddDialogOpen(false);
        toast({
          title: 'Успешно',
          description: 'Растение добавлено'
        });
      }
    } catch (error) {
      toast({
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
    
    const updatedPlant = {
      id: editingPlant.id,
      name: formData.get('name') as string,
      price: parseInt(formData.get('price') as string),
      category: formData.get('category') as 'decorative' | 'fruit',
      image: formData.get('image') as string,
      description: formData.get('description') as string
    };

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
        setPlants(plants.map(p => p.id === updated.id ? updated : p));
        setEditingPlant(null);
        toast({
          title: 'Успешно',
          description: 'Растение обновлено'
        });
      }
    } catch (error) {
      toast({
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
        setPlants(plants.filter(p => p.id !== id));
        toast({
          title: 'Успешно',
          description: 'Растение удалено'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить растение',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const updatedSettings = {
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      working_hours: formData.get('working_hours') as string
    };

    try {
      const response = await fetch(SETTINGS_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPassword
        },
        body: JSON.stringify(updatedSettings)
      });

      if (response.ok) {
        setSettings(updatedSettings);
        toast({
          title: 'Успешно',
          description: 'Настройки обновлены'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить настройки',
        variant: 'destructive'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/15">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Lock" size={24} className="text-primary" />
              <CardTitle>Админ-панель</CardTitle>
            </div>
            <CardDescription>Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Введите пароль администратора"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  <Icon name="Home" size={18} className="mr-2" />
                  На главную
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/20">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold text-primary">Админ-панель Plant Shop</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="plants">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="plants">
              <Icon name="Sprout" size={18} className="mr-2" />
              Растения
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plants" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление растениями</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить растение
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новое растение</DialogTitle>
                    <DialogDescription>Заполните данные о растении</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPlant} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-name">Название</Label>
                      <Input id="add-name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-price">Цена (₽)</Label>
                      <Input id="add-price" name="price" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-category">Категория</Label>
                      <Select name="category" defaultValue="decorative" required>
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
                      <Label htmlFor="add-image">URL изображения</Label>
                      <Input id="add-image" name="image" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-description">Описание</Label>
                      <Textarea id="add-description" name="description" required />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Добавить</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {plants.map(plant => (
                <Card key={plant.id}>
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
                        <Dialog open={editingPlant?.id === plant.id} onOpenChange={(open) => !open && setEditingPlant(null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingPlant(plant)}>
                              <Icon name="Edit" size={16} className="mr-2" />
                              Изменить
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Редактировать растение</DialogTitle>
                              <DialogDescription>Измените данные растения</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleUpdatePlant} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Название</Label>
                                <Input id="edit-name" name="name" defaultValue={plant.name} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">Цена (₽)</Label>
                                <Input id="edit-price" name="price" type="number" defaultValue={plant.price} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">Категория</Label>
                                <Select name="category" defaultValue={plant.category} required>
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
                                <Label htmlFor="edit-image">URL изображения</Label>
                                <Input id="edit-image" name="image" defaultValue={plant.image} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Описание</Label>
                                <Textarea id="edit-description" name="description" defaultValue={plant.description} required />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Сохранить</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePlant(plant.id)}>
                          <Icon name="Trash2" size={16} className="mr-2" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-2xl font-bold">Настройки сайта</h2>
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
                <CardDescription>Обновите контактные данные магазина</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSettings} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" name="phone" defaultValue={settings.phone} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={settings.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес</Label>
                    <Input id="address" name="address" defaultValue={settings.address} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="working_hours">Часы работы</Label>
                    <Input id="working_hours" name="working_hours" defaultValue={settings.working_hours} required />
                  </div>
                  <Button type="submit">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить изменения
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
