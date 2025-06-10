import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    if (!data) {
      return NextResponse.json(
        { error: 'No data provided for scanning.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'VirusTotal API key is not configured.' },
        { status: 500 }
      );
    }

    // Отправляем данные на VirusTotal
    const response = await fetch('https://www.virustotal.com/api/v3/files', {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
      },
      body: Buffer.from(data), // Если это бинарные данные
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'VirusTotal API error.', details: errorData },
        { status: 500 }
      );
    }

    const result = await response.json();
    return NextResponse.json({ analysis: result });
  } catch (error) {
    console.error('Virus scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan for viruses.' },
      { status: 500 }
    );
  }
}
