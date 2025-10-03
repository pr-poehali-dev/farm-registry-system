import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import LoginForm from '@/components/admin/LoginForm';
import PlantsManagement from '@/components/admin/PlantsManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';

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

  const handleLogin = async (password: string) => {
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
            <PlantsManagement
              plants={plants}
              adminPassword={adminPassword}
              onPlantsUpdate={setPlants}
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
