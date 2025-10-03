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
}

export interface ToastConfig {
  title: string;
  description: string;
  variant?: 'destructive';
}
