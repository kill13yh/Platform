import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { encrypt } from '@/app/lib/utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Ищем пользователя по email
    const encryptedEmail = encrypt(email);
    const result = await sql`
      SSELECT id, email, password
      FROM users
      WHERE email = ${encryptedEmail};
    `;

    const user = result[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // TODO: создать JWT или сессию
    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to log in.' }, { status: 500 });
  }
}
