import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import PlantsManagement from './PlantsManagement';
import OrdersManagement from './OrdersManagement';
import SettingsManagement from './SettingsManagement';
import Icon from '@/components/ui/icon';
import type { Plant, Settings } from '@/types/admin';

interface AdminPanelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANTS_API = 'https://functions.poehali.dev/98192740-b9c9-4e26-8011-0e62528d35d5';
const SETTINGS_API = 'https://functions.poehali.dev/2cc392a6-5375-4f6d-aead-d8a3ac112c4c';

export default function AdminPanelDialog({ isOpen, onClose }: AdminPanelDialogProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('plants');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [settings, setSettings] = useState<Settings>({
    phone: '',
    email: '',
    address: '',
    working_hours: '',
    site_name: ''
  });
  const { toast } = useToast();
  const adminPassword = 'admin123';

  useEffect(() => {
    if (isOpen) {
      const savedAuth = localStorage.getItem('admin_auth');
      if (savedAuth) {
        setIsAuthenticated(true);
        loadData();
      }
    } else {
      setPasswordInput('');
      setIsAuthenticated(false);
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      loadData();
      toast({
        title: 'Успешно',
        description: 'Вход в админ-панель выполнен'
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный пароль',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    setPasswordInput('');
    onClose();
  };

  const loadData = async () => {
    try {
      const [plantsRes, settingsRes] = await Promise.all([
        fetch(PLANTS_API),
        fetch(SETTINGS_API)
      ]);

      if (plantsRes.ok) {
        const plantsData = await plantsRes.json();
        setPlants(plantsData);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Shield" size={24} className="text-primary" />
              Вход в админ-панель
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Пароль</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Введите пароль"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Shield" size={24} className="text-primary" />
              Панель администратора
            </DialogTitle>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeAdminTab} onValueChange={setActiveAdminTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plants" className="flex items-center gap-2">
              <Icon name="Leaf" size={16} />
              Растения
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Icon name="Package" size={16} />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Icon name="Settings" size={16} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="plants" className="m-0">
              <PlantsManagement 
                plants={plants}
                adminPassword={adminPassword}
                onPlantsUpdate={setPlants}
                onToast={toast}
              />
            </TabsContent>

            <TabsContent value="orders" className="m-0">
              <OrdersManagement 
                adminPassword={adminPassword}
                onToast={toast}
              />
            </TabsContent>

            <TabsContent value="settings" className="m-0">
              <SettingsManagement 
                settings={settings}
                adminPassword={adminPassword}
                onSettingsUpdate={setSettings}
                onToast={toast}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}