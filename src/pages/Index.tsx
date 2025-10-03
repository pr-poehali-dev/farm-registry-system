import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

const plants: Plant[] = [
  {
    id: 1,
    name: 'Монстера деликатесная',
    price: 2500,
    category: 'decorative',
    image: '/img/f94d0d6a-3ce1-4a57-938c-94f91cc55aaf.jpg',
    description: 'Тропическое растение с крупными резными листьями'
  },
  {
    id: 2,
    name: 'Лимонное дерево',
    price: 3500,
    category: 'fruit',
    image: '/img/5903317a-1357-4f1b-b75b-1cb758d50a0e.jpg',
    description: 'Плодовое цитрусовое дерево для дома'
  },
  {
    id: 3,
    name: 'Композиция суккулентов',
    price: 1500,
    category: 'decorative',
    image: '/img/8445a9c4-74b9-4357-aa67-db08306aae0a.jpg',
    description: 'Неприхотливая композиция из разных суккулентов'
  }
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState<Plant[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userName, setUserName] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setUserName('Садовод');
    toast({
      title: 'Добро пожаловать!',
      description: 'Вы успешно вошли в систему'
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setUserName('Садовод');
    toast({
      title: 'Регистрация успешна!',
      description: 'Ваш аккаунт создан'
    });
  };

  const addToCart = (plant: Plant) => {
    setCart([...cart, plant]);
    toast({
      title: 'Добавлено в корзину',
      description: plant.name
    });
  };

  const toggleFavorite = (plantId: number) => {
    if (favorites.includes(plantId)) {
      setFavorites(favorites.filter(id => id !== plantId));
    } else {
      setFavorites([...favorites, plantId]);
    }
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, plant) => sum + plant.price, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/20">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Sprout" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold text-primary">Plant Shop</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab('home')} className="hover:text-primary transition-colors">
                Главная
              </button>
              <button onClick={() => setActiveTab('catalog')} className="hover:text-primary transition-colors">
                Каталог
              </button>
              <button onClick={() => setActiveTab('delivery')} className="hover:text-primary transition-colors">
                Доставка
              </button>
              <button onClick={() => setActiveTab('tips')} className="hover:text-primary transition-colors">
                Советы
              </button>
              <button onClick={() => setActiveTab('contacts')} className="hover:text-primary transition-colors">
                Контакты
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="Heart" size={20} />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Избранное</SheetTitle>
                    <SheetDescription>Ваши любимые растения</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {plants.filter(p => favorites.includes(p.id)).map(plant => (
                      <Card key={plant.id}>
                        <CardContent className="p-4 flex gap-3">
                          <img src={plant.image} alt={plant.name} className="w-16 h-16 rounded object-cover" />
                          <div className="flex-1">
                            <p className="font-medium">{plant.name}</p>
                            <p className="text-sm text-muted-foreground">{plant.price} ₽</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {favorites.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Нет избранных товаров</p>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                    <SheetDescription>Ваши покупки</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.map((plant, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 flex gap-3">
                          <img src={plant.image} alt={plant.name} className="w-16 h-16 rounded object-cover" />
                          <div className="flex-1">
                            <p className="font-medium">{plant.name}</p>
                            <p className="text-sm text-muted-foreground">{plant.price} ₽</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)}>
                            <Icon name="X" size={16} />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {cart.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">Итого:</span>
                          <span className="text-xl font-bold text-primary">{calculateTotal()} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    )}
                    {cart.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {isAuthenticated ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Профиль</SheetTitle>
                      <SheetDescription>Управление аккаунтом</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="text-center py-4">
                        <Avatar className="h-20 w-20 mx-auto mb-4">
                          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                            {userName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg">{userName}</h3>
                        <p className="text-sm text-muted-foreground">садовод@email.com</p>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Icon name="Package" size={18} className="mr-2" />
                          Мои заказы
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Icon name="Settings" size={18} className="mr-2" />
                          Настройки
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={() => setIsAuthenticated(false)}
                        >
                          <Icon name="LogOut" size={18} className="mr-2" />
                          Выйти
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default">
                      <Icon name="User" size={18} className="mr-2" />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Вход в аккаунт</DialogTitle>
                      <DialogDescription>Войдите или создайте новый аккаунт</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Вход</TabsTrigger>
                        <TabsTrigger value="register">Регистрация</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="your@email.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Пароль</Label>
                            <Input id="password" type="password" required />
                          </div>
                          <Button type="submit" className="w-full">Войти</Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reg-name">Имя</Label>
                            <Input id="reg-name" placeholder="Ваше имя" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-email">Email</Label>
                            <Input id="reg-email" type="email" placeholder="your@email.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-password">Пароль</Label>
                            <Input id="reg-password" type="password" required />
                          </div>
                          <Button type="submit" className="w-full">Зарегистрироваться</Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
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
                  <Button size="lg" variant="outline">
                    Узнать больше
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
                  <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        onClick={() => toggleFavorite(plant.id)}
                      >
                        <Icon 
                          name="Heart" 
                          size={20} 
                          className={favorites.includes(plant.id) ? 'fill-red-500 text-red-500' : ''} 
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
                      <Button onClick={() => addToCart(plant)}>
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
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
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Каталог растений</h2>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="decorative">Декоративные</TabsTrigger>
                <TabsTrigger value="fruit">Плодовые</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plants.map(plant => (
                    <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img src={plant.image} alt={plant.name} className="w-full h-64 object-cover" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(plant.id)}
                        >
                          <Icon name="Heart" size={20} className={favorites.includes(plant.id) ? 'fill-red-500 text-red-500' : ''} />
                        </Button>
                      </div>
                      <CardHeader>
                        <CardTitle>{plant.name}</CardTitle>
                        <CardDescription>{plant.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">{plant.price} ₽</span>
                        <Button onClick={() => addToCart(plant)}>
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="decorative" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plants.filter(p => p.category === 'decorative').map(plant => (
                    <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img src={plant.image} alt={plant.name} className="w-full h-64 object-cover" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(plant.id)}
                        >
                          <Icon name="Heart" size={20} className={favorites.includes(plant.id) ? 'fill-red-500 text-red-500' : ''} />
                        </Button>
                      </div>
                      <CardHeader>
                        <CardTitle>{plant.name}</CardTitle>
                        <CardDescription>{plant.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">{plant.price} ₽</span>
                        <Button onClick={() => addToCart(plant)}>
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="fruit" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plants.filter(p => p.category === 'fruit').map(plant => (
                    <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img src={plant.image} alt={plant.name} className="w-full h-64 object-cover" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(plant.id)}
                        >
                          <Icon name="Heart" size={20} className={favorites.includes(plant.id) ? 'fill-red-500 text-red-500' : ''} />
                        </Button>
                      </div>
                      <CardHeader>
                        <CardTitle>{plant.name}</CardTitle>
                        <CardDescription>{plant.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">{plant.price} ₽</span>
                        <Button onClick={() => addToCart(plant)}>
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'delivery' && (
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
        )}

        {activeTab === 'tips' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold">Советы по уходу</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Droplets" size={24} className="text-primary" />
                    Полив
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Регулярность полива зависит от вида растения. Большинство комнатных растений 
                    предпочитают умеренный полив 1-2 раза в неделю. Перед поливом проверяйте почву.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Sun" size={24} className="text-primary" />
                    Освещение
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Большинство растений любят яркий рассеянный свет. Избегайте прямых солнечных лучей, 
                    которые могут обжечь листья.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Thermometer" size={24} className="text-primary" />
                    Температура
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Оптимальная температура для большинства комнатных растений — 18-24°C. 
                    Избегайте резких перепадов температуры и сквозняков.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
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
        )}
      </main>

      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Sprout" size={24} />
                <span className="font-bold text-lg">Plant Shop</span>
              </div>
              <p className="text-sm opacity-90">
                Живые растения для вашего дома и офиса
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Каталог</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>Декоративные растения</li>
                <li>Плодовые растения</li>
                <li>Кактусы и суккуленты</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Информация</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>О компании</li>
                <li>Доставка</li>
                <li>Оплата</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Контакты</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>+7 (900) 123-45-67</li>
                <li>info@plantshop.ru</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-75">
            © 2024 Plant Shop. Все права защищены
          </div>
        </div>
      </footer>
    </div>
  );
}
