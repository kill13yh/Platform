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
export async function createTextAnalysis(
  prevState: State,
  data: { text: string; isToxic: boolean }
) {
  const validatedFields = TextAnalysisSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create text analysis.',
    };
  }

  const { text, isToxic } = validatedFields.data;

  try {
    // Вставляем данные в базу данных
    const inserted = await sql`
      INSERT INTO text_analyses (text, isToxic)
      VALUES (${text}, ${isToxic})
      RETURNING id, text, isToxic, created_at;
    `;

    const analysis = inserted[0];

    revalidatePath('/dashboard/text-analyses');
    return {
      message: 'Text analysis created successfully.',
      analysis, // <-- возвращаем свежую запись
    };
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
export async function createIpCheck(
  prevState: State,
  data: {
    ip: string;
    malicious: boolean;
    abuseConfidenceScore: number;
    country?: string | null;
  }
) {
  const validatedFields = IpCheckSchema.safeParse(data);

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
    revalidatePath('/dashboard/ip-checks');
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
export async function createVirusScan(
  prevState: State,
  data: { data: string; infected: boolean; message?: string | null }
) {
  const validatedFields = VirusScanSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create virus scan.',
    };
  }

  const { data: fileData, infected, message } = validatedFields.data;

  try {
    await sql`
      INSERT INTO virus_scans (data, infected, message)
      VALUES (${fileData}, ${infected}, ${message});
    `;
    revalidatePath('/dashboard/virus-scans');
    return { message: 'Virus scan created successfully.' };
  } catch (error) {
    console.error('Database Error [createVirusScan]:', error);
    return { message: 'Database Error: Failed to create virus scan.' };
  }
}

// ✅ Аутентификация
export async function authenticate(
  prevState: string | undefined,
  data: { email: string; password: string }
) {
  try {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
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
