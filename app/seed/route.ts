import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Создание таблицы пользователей
async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('✅ Таблица users успешно создана и заполнена.');
}

// Создание таблицы текстовых анализов
async function seedTextAnalyses() {
  await sql`
    CREATE TABLE IF NOT EXISTS text_analyses (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      text TEXT NOT NULL,
      isToxic BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('✅ Таблица text_analyses создана.');
}

// Создание таблицы проверок IP
async function seedIpChecks() {
  await sql`
    CREATE TABLE IF NOT EXISTS ip_checks (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      ip TEXT NOT NULL,
      malicious BOOLEAN NOT NULL,
      abuse_confidence_score INT,
      country VARCHAR(100),
      checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('✅ Таблица ip_checks создана.');
}

// Создание таблицы вирус-сканов
async function seedVirusScans() {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS virus_scans (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      data TEXT NOT NULL,
      infected BOOLEAN NOT NULL,
      message TEXT,
      scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// API-эндпоинт для сидирования базы данных
export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedUsers();
      await seedTextAnalyses();
      await seedIpChecks();
      await seedVirusScans();
    });

    return Response.json({ message: 'Database seeded successfully.' });
  } catch (error: unknown) {
    console.error('❌ Ошибка при сидировании:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
