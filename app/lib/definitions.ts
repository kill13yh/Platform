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
  uuid: string;           // уникальный идентификатор
  text: string;           // текст
  created_at: string;     // дата создания
  isToxic: boolean;       // токсичность
};

// Проверка IP
export type IpCheckResult = {
  malicious: boolean;
  abuseConfidenceScore?: number;
  country?: string;
};

// Результат сканирования данных
export type VirusScanResult = {
  infected: boolean;
  message: string;
};

// Форма для регистрации/логина
export type AuthForm = {
  email: string;
  password: string;
};
