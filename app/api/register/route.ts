import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }


    // Проверяем наличие пользователя
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохраняем пользователя
    await sql`
      INSERT INTO users (email, password)
      VALUES (${email}, ${hashedPassword});
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
