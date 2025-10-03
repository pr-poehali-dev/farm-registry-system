CREATE TABLE IF NOT EXISTS plants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('decorative', 'fruit')),
    image VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO plants (name, price, category, image, description) VALUES
    ('Монстера деликатесная', 2500, 'decorative', '/img/f94d0d6a-3ce1-4a57-938c-94f91cc55aaf.jpg', 'Тропическое растение с крупными резными листьями'),
    ('Лимонное дерево', 3500, 'fruit', '/img/5903317a-1357-4f1b-b75b-1cb758d50a0e.jpg', 'Плодовое цитрусовое дерево для дома'),
    ('Композиция суккулентов', 1500, 'decorative', '/img/8445a9c4-74b9-4357-aa67-db08306aae0a.jpg', 'Неприхотливая композиция из разных суккулентов');

INSERT INTO site_settings (key, value) VALUES
    ('phone', '+7 (900) 123-45-67'),
    ('email', 'info@plantshop.ru'),
    ('address', 'г. Москва, ул. Садовая, д. 15'),
    ('working_hours', 'Пн-Вс: 9:00 - 21:00'),
    ('admin_password', 'admin123')
ON CONFLICT (key) DO NOTHING;