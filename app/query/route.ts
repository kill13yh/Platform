import postgres from 'postgres';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Создаём подключение к БД Neon
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Пример: Получить последние токсичные тексты
async function listToxicTextAnalyses() {
  const data = await sql`
    SELECT text, isToxic, created_at
    FROM text_analyses
    WHERE isToxic = true
    ORDER BY created_at DESC
    LIMIT 10
  `;
  return data;
}

// Обработчик GET-запроса
export async function GET() {
  try {
    const result = await listToxicTextAnalyses();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch toxic text analyses.' },
      { status: 500 }
    );
  }
}
