import { NextResponse } from 'next/server';
import { encrypt, decrypt } from '@/app/lib/utils';

export async function POST(req: Request) {
  try {
    const { text, decryptMode } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }

    if (decryptMode) {
      const decrypted = decrypt(text);
      return NextResponse.json({ decrypted });
    } else {
      const encrypted = encrypt(text);
      return NextResponse.json({ encrypted });
    }
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json({ error: 'Encryption/Decryption failed.' }, { status: 500 });
  }
}
