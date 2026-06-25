export type View = 'home' | 'terms' | 'privacy' | 'refund' | 'contact' | 'services' | 'checkout' | 'dashboard' | 'products';

export interface User {
  name: string;
  email: string;
  initials: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface ScopingFormData {
  platform: 'web' | 'mobile' | 'automation' | null;
  scale: 'mvp' | 'scale' | 'enterprise' | null;
  name: string;
  email: string;
  phone: string;
  objectives: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
}

export interface ServiceProduct {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  price: number;
  iconName: string;
}
