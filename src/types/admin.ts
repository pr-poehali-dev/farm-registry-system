export interface Plant {
  id: number;
  name: string;
  price: number;
  category: 'decorative' | 'fruit';
  image: string;
  description: string;
}

export interface Settings {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  site_name?: string;
}

export interface ToastConfig {
  title: string;
  description: string;
  variant?: 'destructive';
}

export interface OrderItem {
  plant_id?: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  user_id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_address: string;
  created_at: string;
  items: OrderItem[];
}