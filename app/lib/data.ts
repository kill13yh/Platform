import postgres from 'postgres';
import {
  TextAnalysisResult,
  IpCheckResult,
  VirusScanResult,
  Revenue
} from './definitions';
import { revenue as revenueData } from './placeholder-data';

// Настройка подключения к PostgreSQL
// Использует переменные окружения или локальные значения по умолчанию
const sql = postgres({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || 'myprojectdb',
  username: process.env.POSTGRES_USER || 'myuser',
  password: process.env.POSTGRES_PASSWORD || 'mypassword',
  ssl: false // Для локальной разработки ssl: false
});

/**
 * Получение количества анализов текста
 */
export async function fetchTextAnalysisCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*)::int AS count FROM text_analyses;`;
    return result[0].count;
  } catch (error: unknown) {
    console.error('Database Error [fetchTextAnalysisCount]:', error);
    throw new Error('Failed to fetch text analysis count.');
  }
}

/**
 * Получение количества проверок IP
 */
export async function fetchIpCheckCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*)::int AS count FROM ip_checks;`;
    return result[0].count;
  } catch (error: unknown) {
    console.error('Database Error [fetchIpCheckCount]:', error);
    throw new Error('Failed to fetch IP check count.');
  }
}

/**
 * Получение количества сканирований вирусов
 */
export async function fetchVirusScanCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*)::int AS count FROM virus_scans;`;
    return result[0].count;
  } catch (error: unknown) {
    console.error('Database Error [fetchVirusScanCount]:', error);
    throw new Error('Failed to fetch virus scan count.');
  }
}

/**
 * Получение последних анализов текста
 */
export async function fetchLatestTextAnalyses(limit: number = 5): Promise<TextAnalysisResult[]> {
  try {
    const data = await sql<TextAnalysisResult[]>`
      SELECT id, text, isToxic, created_at
      FROM text_analyses
      ORDER BY created_at DESC
      LIMIT ${limit};
    `;
    return data;
  } catch (error: unknown) {
    console.error('Database Error [fetchLatestTextAnalyses]:', error);
    throw new Error('Failed to fetch latest text analyses.');
  }
}

/**
 * Получение последних проверок IP
 */
export async function fetchLatestIpChecks(limit: number = 5): Promise<IpCheckResult[]> {
  try {
    const data = await sql<IpCheckResult[]>`
      SELECT id, ip, malicious, abuse_confidence_score AS "abuseConfidenceScore", country, checked_at
      FROM ip_checks
      ORDER BY checked_at DESC
      LIMIT ${limit};
    `;
    return data;
  } catch (error: unknown) {
    console.error('Database Error [fetchLatestIpChecks]:', error);
    throw new Error('Failed to fetch latest IP checks.');
  }
}

/**
 * Получение последних сканирований вирусов
 */
export async function fetchLatestVirusScans(limit: number = 5): Promise<VirusScanResult[]> {
  try {
    const data = await sql<VirusScanResult[]>`
      SELECT id, data, infected, message, scanned_at
      FROM virus_scans
      ORDER BY scanned_at DESC
      LIMIT ${limit};
    `;
    return data;
  } catch (error: unknown) {
    console.error('Database Error [fetchLatestVirusScans]:', error);
    throw new Error('Failed to fetch latest virus scans.');
  }
}


/**
 * Получение данных о доходах за последние месяцы
 */
export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    // В реальном приложении здесь могла бы быть выборка из таблицы `revenue`
    // Например:
    // const data = await sql<Revenue[]>`SELECT month, revenue FROM revenue ORDER BY month;`;
    // return data;

    // Пока используем локальные заглушки
    return revenueData;
  } catch (error: unknown) {
    console.error('Database Error [fetchRevenue]:', error);
    throw new Error('Failed to fetch revenue.');
  }
}