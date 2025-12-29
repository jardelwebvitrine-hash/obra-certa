
export enum ServiceCategory {
  CONSTRUCTION = 'Construção',
  MAINTENANCE = 'Manutenção',
  INSTALLATION = 'Instalação'
}

export enum UserRole {
  CLIENT = 'Cliente',
  PROFESSIONAL = 'Profissional',
  ADMIN = 'Administrador'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  rating: number;
  reviewCount: number;
  isVerified?: boolean;
  location?: { lat: number; lng: number };
  credits?: number;
  isBlocked?: boolean;
  pinHash?: string; // Hash do PIN de 6 dígitos
  failedPinAttempts?: number;
  lockoutUntil?: number; // Timestamp de quando o bloqueio expira
}

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  priceEstimate: string;
  icon?: string;
}

export interface Lead {
  id: string;
  title: string;
  location: string;
  budget: string;
  category: ServiceCategory;
  creditsCost: number;
  status: 'available' | 'reserved' | 'unlocked' | 'responded' | 'expired';
  viewedByClient: boolean;
  clientResponded: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: 'Iniciado' | 'Em Progresso' | 'Concluído' | 'Pendente';
  progress: number;
  budget: number;
  spent: number;
  type: ServiceCategory;
  date: string;
  clientId?: string;
  proId?: string;
  locationName?: string;
  rating?: number;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  image?: string;
  isBudget?: boolean;
}
