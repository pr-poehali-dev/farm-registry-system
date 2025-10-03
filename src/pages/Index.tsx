import { useState } from 'react';
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

        {activeTab === 'contacts' && <ContactsSection />}
      </main>

      <PlantShopFooter />
    </div>
  );
}
