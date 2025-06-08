import { NextResponse } from 'next/server';

// Заглушка (демо) для проверки IP на вредоносность
function simpleIpCheck(ip: string): { malicious: boolean; message: string } {
  const maliciousIps = ['123.45.67.89', '8.8.8.8']; // demo blacklist
  const malicious = maliciousIps.includes(ip);
  const message = malicious
    ? 'IP address flagged as potentially malicious.'
    : 'IP address appears safe.';
  return { malicious, message };
}

export async function POST(req: Request) {
  try {
    const { ip } = await req.json();
    if (!ip) {
      return NextResponse.json(
        { error: 'No IP address provided.' },
        { status: 400 }
      );
    }

    // Заглушка проверки (можно заменить на реальный API, например AbuseIPDB)
    const result = simpleIpCheck(ip);

    return NextResponse.json(result);
  } catch (error) {
    console.error('IP check error:', error);
    return NextResponse.json(
      { error: 'Failed to check IP address.' },
      { status: 500 }
    );
  }
}
