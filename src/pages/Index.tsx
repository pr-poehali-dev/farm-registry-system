import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import PlantShopHeader from '@/components/PlantShopHeader';
import PlantShopFooter from '@/components/PlantShopFooter';
import HomeSection from '@/components/HomeSection';
import CatalogSection from '@/components/CatalogSection';
import DeliverySection from '@/components/DeliverySection';
import TipsSection from '@/components/TipsSection';
import ContactsSection from '@/components/ContactsSection';

interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

const PLANTS_API = 'https://functions.poehali.dev/98192740-b9c9-4e26-8011-0e62528d35d5';
const SETTINGS_API = 'https://functions.poehali.dev/2cc392a6-5375-4f6d-aead-d8a3ac112c4c';

interface Settings {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  site_name?: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState<Plant[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userName, setUserName] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [settings, setSettings] = useState<Settings>({
    phone: '',
    email: '',
    address: '',
    working_hours: '',
    site_name: 'Зелёный Оазис'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

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
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/20">
      <PlantShopHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        cart={cart}
        favorites={favorites}
        userName={userName}
        setUserName={setUserName}
        plants={plants}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
        siteName={settings.site_name}
      />

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <HomeSection
            plants={plants}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogSection
            plants={plants}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
          />
        )}

        {activeTab === 'delivery' && <DeliverySection />}

        {activeTab === 'tips' && <TipsSection />}

        {activeTab === 'contacts' && <ContactsSection settings={settings} />}
      </main>

      <PlantShopFooter />
    </div>
  );
}