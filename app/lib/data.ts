import postgres from 'postgres';
import {
  TextAnalysisResult,
  IpCheckResult,
  VirusScanResult
} from './definitions';

// Настройка подключения к базе данных Neon
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

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
      SELECT uuid, text, isToxic, created_at
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
