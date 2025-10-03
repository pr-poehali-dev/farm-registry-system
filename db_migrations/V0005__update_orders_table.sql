-- Добавление полей для заказов
ALTER TABLE t_p64494902_farm_registry_system.orders 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS comment TEXT;

-- Создание индекса для поиска по email
CREATE INDEX IF NOT EXISTS idx_orders_email ON t_p64494902_farm_registry_system.orders(email);
