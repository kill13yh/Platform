import { NextResponse } from 'next/server';
import { preprocessText } from '@/app/lib/utils';
import OpenAI from 'openai';

// 📦 Заглушка ИИ: проверяем токсичность
function simpleTextAnalysis(text: string): { isToxic: boolean } {
  const lower = text.toLowerCase();
  const badWords = ['badword', 'hate', 'angry'];
  return { isToxic: badWords.some(word => lower.includes(word)) };
}

const openaiApiKey = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const preprocessed = preprocessText(text);

    // Если есть OpenAI ключ — подключаем GPT
    if (openaiApiKey) {
      const openai = new OpenAI({ apiKey: openaiApiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Analyze the text.' },
          { role: 'user', content: `Analyze this text for toxicity: ${preprocessed}` },
        ],
      });
      const answer = completion.choices[0].message.content || 'No analysis';
      return NextResponse.json({ result: answer });
    } 
    
    // Иначе используем заглушку
    const result = simpleTextAnalysis(preprocessed);
    return NextResponse.json(result);

  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze text.' }, { status: 500 });
  }
}
