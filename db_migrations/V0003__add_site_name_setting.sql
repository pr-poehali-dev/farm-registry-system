INSERT INTO site_settings (key, value) 
VALUES ('site_name', 'Plant Shop') 
ON CONFLICT (key) DO NOTHING;