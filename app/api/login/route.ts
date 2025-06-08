import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';


export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  // TODO: создать JWT или сессию
  return NextResponse.json({ success: true });
}
