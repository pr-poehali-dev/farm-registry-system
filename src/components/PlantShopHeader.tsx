import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import CheckoutDialog from '@/components/CheckoutDialog';
import MyOrdersDialog from '@/components/MyOrdersDialog';
import AdminPanelDialog from '@/components/admin/AdminPanelDialog';

interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

interface PlantShopHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  cart: Plant[];
  favorites: number[];
  userName: string;
  setUserName: (name: string) => void;
  plants: Plant[];
  handleLogin: (e: React.FormEvent) => void;
  handleRegister: (e: React.FormEvent) => void;
  removeFromCart: (index: number) => void;
  calculateTotal: () => number;
  siteName?: string;
  onOrderComplete: (totalAmount: number) => void;
  onToast: (toast: { title: string; description: string; variant?: 'default' | 'destructive' }) => void;
  userEmail: string;
  userBalance?: number;
  userCashback?: number;
  userRole?: 'user' | 'admin';
}

export default function PlantShopHeader({
  activeTab,
  setActiveTab,
  isAuthenticated,
  setIsAuthenticated,
  cart,
  favorites,
  userName,
  plants,
  handleLogin,
  handleRegister,
  removeFromCart,
  calculateTotal,
  siteName = 'Зелёный Оазис',
  onOrderComplete,
  onToast,
  userEmail,
  userBalance = 0,
  userCashback = 0,
  userRole = 'user'
}: PlantShopHeaderProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  return (
    <>
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Sprout" size={32} className="text-primary" />
            <h1 className="text-2xl font-bold text-primary">{siteName}</h1>
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
                      <Button className="w-full" size="lg" onClick={() => setIsCheckoutOpen(true)}>
                        <Icon name="ShoppingBag" size={18} className="mr-2" />
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
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Icon name="Wallet" size={18} className="text-primary" />
                            <span className="text-sm font-medium">Баланс</span>
                          </div>
                          <span className="font-bold text-primary">{userBalance} ₽</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Icon name="Gift" size={18} className="text-primary" />
                            <span className="text-sm font-medium">Кэшбек</span>
                          </div>
                          <span className="font-bold text-primary">{userCashback} ₽</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {userRole === 'admin' && (
                        <Button 
                          variant="default" 
                          className="w-full justify-start"
                          onClick={() => setIsAdminPanelOpen(true)}
                        >
                          <Icon name="Shield" size={18} className="mr-2" />
                          Админ-панель
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsOrdersOpen(true)}
                      >
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
                        onClick={() => {
                          localStorage.removeItem('user_auth');
                          setIsAuthenticated(false);
                        }}
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
                          <Label htmlFor="login-name">Имя</Label>
                          <Input id="login-name" placeholder="Ваше имя" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="your@email.com" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Пароль</Label>
                          <Input id="password" type="password" />
                          <p className="text-xs text-muted-foreground">
                            🔑 Для админа: admin@plantshop.ru (без пароля)
                          </p>
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

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        calculateTotal={calculateTotal}
        onOrderComplete={onOrderComplete}
        onToast={onToast}
        userName={userName}
        userEmail={userEmail}
        userBalance={userBalance}
      />

      <MyOrdersDialog
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        userEmail={userEmail}
        onGoToCatalog={() => setActiveTab('catalog')}
      />

      {userRole === 'admin' && (
        <AdminPanelDialog
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}
    </>
  );
}