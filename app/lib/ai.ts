'use server';

export async function analyzeText(text: string): Promise<{ isToxic: boolean }> {
  // Заглушка для анализа текста:
  const isToxic = text.toLowerCase().includes('badword');
  return { isToxic };
}
