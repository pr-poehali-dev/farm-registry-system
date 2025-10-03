import Icon from '@/components/ui/icon';

interface Settings {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  site_name?: string;
}

interface PlantShopFooterProps {
  settings: Settings;
  setActiveTab: (tab: string) => void;
}

export default function PlantShopFooter({ settings, setActiveTab }: PlantShopFooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = settings.site_name || 'Plant Shop';

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Sprout" size={24} />
              <span className="font-bold text-lg">{siteName}</span>
            </div>
            <p className="text-sm opacity-90">
              Живые растения для вашего дома и офиса
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Каталог</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => setActiveTab('catalog')} 
                  className="opacity-90 hover:opacity-100 hover:underline transition-all text-left"
                >
                  Декоративные растения
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('catalog')} 
                  className="opacity-90 hover:opacity-100 hover:underline transition-all text-left"
                >
                  Плодовые растения
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('catalog')} 
                  className="opacity-90 hover:opacity-100 hover:underline transition-all text-left"
                >
                  Все растения
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Информация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => setActiveTab('home')} 
                  className="opacity-90 hover:opacity-100 hover:underline transition-all text-left"
                >
                  О компании
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('delivery')} 
                  className="opacity-90 hover:opacity-100 hover:underline transition-all text-left"
                >
                  Доставка
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tips')} 
                  className="opacity-90 hover:opacity-100 hover:underline transition-all text-left"
                >
                  Советы по уходу
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Контакты</h4>
            <ul className="space-y-2 text-sm">
              {settings.phone && (
                <li>
                  <a 
                    href={`tel:${settings.phone.replace(/\s/g, '')}`} 
                    className="opacity-90 hover:opacity-100 hover:underline transition-all flex items-center gap-2"
                  >
                    <Icon name="Phone" size={14} />
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a 
                    href={`mailto:${settings.email}`} 
                    className="opacity-90 hover:opacity-100 hover:underline transition-all flex items-center gap-2"
                  >
                    <Icon name="Mail" size={14} />
                    {settings.email}
                  </a>
                </li>
              )}
              <li>
                <button 
                  onClick={() => setActiveTab('contacts')} 
                  className="opacity-90 hover:opacity-100 hover:underline transition-all text-left flex items-center gap-2"
                >
                  <Icon name="MapPin" size={14} />
                  Контактная информация
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-75">
          © {currentYear} {siteName}. Все права защищены
        </div>
      </div>
    </footer>
  );
}
