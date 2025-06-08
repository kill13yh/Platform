import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await sql`
        INSERT INTO users (id, email, password)
        VALUES (${user.id}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );
}

async function seedTextAnalyses() {
  await sql`
    CREATE TABLE IF NOT EXISTS text_analyses (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      text TEXT NOT NULL,
      isToxic BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedIpChecks() {
  await sql`
    CREATE TABLE IF NOT EXISTS ip_checks (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      ip TEXT NOT NULL,
      malicious BOOLEAN NOT NULL,
      abuse_confidence_score INT,
      country VARCHAR(100),
      checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

async function seedVirusScans() {
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

export async function GET() {
  try {
    await sql.begin(async () => {
  await seedUsers();
  await seedTextAnalyses();
  await seedIpChecks();
  await seedVirusScans();
});

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error: unknown) {
    console.error('Seeding error:', error);

    // Приводим к типу Error, чтобы получить доступ к error.message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
