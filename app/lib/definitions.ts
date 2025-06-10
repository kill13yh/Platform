// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
// Определения для твоего проекта (ИИ + криптография)

// Пользователь
export type User = {
  id: string;
  email: string;
  password: string;
};

// Анализ текста (ИИ)
export type TextAnalysisResult = {
  uuid: string;
  text: string;
  isToxic: boolean;
  created_at: string;
};

// Проверка IP
export type IpCheckResult = {
  id: string;
  ip: string;
  malicious: boolean;
  abuseConfidenceScore: number;
  country: string;
  checked_at: string;
};

export type VirusScanResult = {
  id: string;
  data: string;
  infected: boolean;
  message: string;
  scanned_at: string;
};

// Форма для регистрации/логина
export type AuthForm = {
  email: string;
  password: string;
};


// Данные о доходах для графика
export type Revenue = {
  month: string;
  revenue: number;
};