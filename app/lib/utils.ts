// app/lib/utils.ts

/**
 * Предобработка текста — удаление пробелов и приведение к нижнему регистру.
 */
export function preprocessText(text: string): string {
  return text.trim().toLowerCase();
}

/**
 * Простейшее "шифрование" на базе Base64 (НЕ использовать в продакшене для чувствительных данных).
 * Для демонстрационных целей подходит.
 */
export function encrypt(text: string): string {
  const buff = Buffer.from(text, 'utf-8');
  return buff.toString('base64');
}

/**
 * Дешифрование строки, зашифрованной с помощью Base64.
 */
export function decrypt(encodedText: string): string {
  const buff = Buffer.from(encodedText, 'base64');
  return buff.toString('utf-8');
}
