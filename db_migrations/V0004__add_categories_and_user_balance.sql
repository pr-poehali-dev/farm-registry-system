-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS t_p64494902_farm_registry_system.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы балансов пользователей
CREATE TABLE IF NOT EXISTS t_p64494902_farm_registry_system.user_balances (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    balance INTEGER DEFAULT 0,
    cashback INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление начальных категорий
INSERT INTO t_p64494902_farm_registry_system.categories (name, description) VALUES
('decorative', 'Декоративные растения'),
('fruit', 'Плодовые растения')
ON CONFLICT (name) DO NOTHING;

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_balances_email ON t_p64494902_farm_registry_system.user_balances(email);
CREATE INDEX IF NOT EXISTS idx_categories_name ON t_p64494902_farm_registry_system.categories(name);
