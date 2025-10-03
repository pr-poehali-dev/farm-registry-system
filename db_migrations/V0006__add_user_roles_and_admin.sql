-- Добавление роли пользователя
ALTER TABLE t_p64494902_farm_registry_system.users 
ADD COLUMN role VARCHAR(20) DEFAULT 'user';

-- Создание индекса для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_users_email ON t_p64494902_farm_registry_system.users(email);

-- Обновление существующего пользователя до роли user
UPDATE t_p64494902_farm_registry_system.users 
SET role = 'user' 
WHERE role IS NULL;

-- Создание админ-аккаунта
INSERT INTO t_p64494902_farm_registry_system.users (email, password_hash, full_name, phone, role)
VALUES (
  'admin@plantshop.ru', 
  'admin_no_password_required', 
  'Администратор', 
  '+7 900 000-00-00',
  'admin'
)
ON CONFLICT DO NOTHING;