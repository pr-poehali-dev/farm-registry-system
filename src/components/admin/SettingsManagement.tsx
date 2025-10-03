import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Settings {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
}

interface SettingsManagementProps {
  settings: Settings;
  adminPassword: string;
  onSettingsUpdate: (settings: Settings) => void;
  onToast: (toast: { title: string; description: string; variant?: 'destructive' }) => void;
}

const SETTINGS_API = 'https://functions.poehali.dev/2cc392a6-5375-4f6d-aead-d8a3ac112c4c';

export default function SettingsManagement({ settings, adminPassword, onSettingsUpdate, onToast }: SettingsManagementProps) {
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
        onSettingsUpdate(updatedSettings);
        onToast({
          title: 'Успешно',
          description: 'Настройки обновлены'
        });
      }
    } catch (error) {
      onToast({
        title: 'Ошибка',
        description: 'Не удалось обновить настройки',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}
