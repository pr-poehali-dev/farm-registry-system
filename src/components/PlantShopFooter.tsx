import Icon from '@/components/ui/icon';

export default function PlantShopFooter() {
  return (
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
  );
}
