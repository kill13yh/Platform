'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Настройка подключения к базе данных PostgreSQL
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 📌 Валидация для текстовых анализов
const TextAnalysisSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty'),
  isToxic: z.boolean(),
});

export type State = {
  errors?: {
    text?: string[];
    isToxic?: string[];
  };
  message?: string | null;
};

// ✅ Создание новой записи в text_analyses
export async function createTextAnalysis(prevState: State, formData: FormData) {
  const validatedFields = TextAnalysisSchema.safeParse({
    text: formData.get('text'),
    isToxic: formData.get('isToxic') === 'true',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create text analysis.',
    };
  }

  const { text, isToxic } = validatedFields.data;

  try {
    await sql`
      INSERT INTO text_analyses (text, isToxic)
      VALUES (${text}, ${isToxic});
    `;
    revalidatePath('/dashboard');
    return { message: 'Text analysis created successfully.' };
  } catch (error) {
    console.error('Database Error [createTextAnalysis]:', error);
    return { message: 'Database Error: Failed to create text analysis.' };
  }
}

// 📌 Валидация для IP Checks
const IpCheckSchema = z.object({
  ip: z.string().min(7, 'Invalid IP address'),
  malicious: z.boolean(),
  abuseConfidenceScore: z.coerce.number().min(0),
  country: z.string().optional(),
});

// ✅ Создание новой записи в ip_checks
export async function createIpCheck(prevState: State, formData: FormData) {
  const validatedFields = IpCheckSchema.safeParse({
    ip: formData.get('ip'),
    malicious: formData.get('malicious') === 'true',
    abuseConfidenceScore: formData.get('abuseConfidenceScore'),
    country: formData.get('country') || null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create IP check.',
    };
  }

  const { ip, malicious, abuseConfidenceScore, country } = validatedFields.data;

  try {
    await sql`
      INSERT INTO ip_checks (ip, malicious, abuse_confidence_score, country)
      VALUES (${ip}, ${malicious}, ${abuseConfidenceScore}, ${country});
    `;
    revalidatePath('/dashboard');
    return { message: 'IP check created successfully.' };
  } catch (error) {
    console.error('Database Error [createIpCheck]:', error);
    return { message: 'Database Error: Failed to create IP check.' };
  }
}

// 📌 Валидация для Virus Scans
const VirusScanSchema = z.object({
  data: z.string().min(1, 'Data cannot be empty'),
  infected: z.boolean(),
  message: z.string().optional(),
});

// ✅ Создание новой записи в virus_scans
export async function createVirusScan(prevState: State, formData: FormData) {
  const validatedFields = VirusScanSchema.safeParse({
    data: formData.get('data'),
    infected: formData.get('infected') === 'true',
    message: formData.get('message') || null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create virus scan.',
    };
  }

  const { data, infected, message } = validatedFields.data;

  try {
    await sql`
      INSERT INTO virus_scans (data, infected, message)
      VALUES (${data}, ${infected}, ${message});
    `;
    revalidatePath('/dashboard');
    return { message: 'Virus scan created successfully.' };
  } catch (error) {
    console.error('Database Error [createVirusScan]:', error);
    return { message: 'Database Error: Failed to create virus scan.' };
  }
}

// ✅ Добавляем функцию authenticate
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
