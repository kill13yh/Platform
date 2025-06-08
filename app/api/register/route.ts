import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Простейшая заглушка регистрации
  // Здесь вместо этого подключи базу данных (Postgres, MongoDB и т.д.)
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Проверим, не существует ли пользователь (эмуляция)
  if (email === 'existing@example.com') {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  // TODO: Хеширование пароля и сохранение пользователя в базе
  // Для демонстрации просто вернём успешный результат
  return NextResponse.json({ success: true });
}
