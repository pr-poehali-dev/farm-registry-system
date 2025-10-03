import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import LoginForm from '@/components/admin/LoginForm';
import PlantsManagement from '@/components/admin/PlantsManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import type { Plant, Settings } from '@/types/admin';

const PLANTS_API = 'https://functions.poehali.dev/98192740-b9c9-4e26-8011-0e62528d35d5';
const SETTINGS_API = 'https://functions.poehali.dev/2cc392a6-5375-4f6d-aead-d8a3ac112c4c';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [settings, setSettings] = useState<Settings>({
    phone: '',
    email: '',
    address: '',
    working_hours: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword) {
      validateAndLogin(savedPassword);
    }
  }, []);

  const validateAndLogin = async (password: string) => {
    if (password === '123') {
      setIsAuthenticated(true);
      setAdminPassword(password);
      loadData();
    } else {
      localStorage.removeItem('admin_password');
    }
  };

  const handleLogin = async (password: string) => {
    if (password === '123') {
      localStorage.setItem('admin_password', password);
      setIsAuthenticated(true);
      setAdminPassword(password);
      loadData();
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
  };

  const loadData = async () => {
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

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
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
              <Button variant="outline" onClick={() => navigate('/')}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="plants">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl">
            <TabsTrigger value="plants">
              <Icon name="Sprout" size={18} className="mr-2" />
              Растения
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Icon name="Package" size={18} className="mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="users">
              <Icon name="Users" size={18} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plants" className="space-y-4">
            <PlantsManagement
              plants={plants}
              adminPassword={adminPassword}
              onPlantsUpdate={setPlants}
              onToast={toast}
            />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrdersManagement
              adminPassword={adminPassword}
              onToast={toast}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersManagement
              onToast={toast}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SettingsManagement
              settings={settings}
              adminPassword={adminPassword}
              onSettingsUpdate={setSettings}
              onToast={toast}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}