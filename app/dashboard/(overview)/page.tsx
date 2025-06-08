import TextAnalyzerCardWrapper from '@/app/ui/dashboard/TextAnalyzerCard';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { CardsSkeleton, AnalyzeTextFormSkeleton } from '@/app/ui/skeletons';
import AnalyzeTextForm from '@/app/ui/dashboard/AnalyzeTextForm';

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      {/* Карточки статистики */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<CardsSkeleton />}>
          <TextAnalyzerCardWrapper />
        </Suspense>
      </div>

      {/* Форма для анализа текста */}
      <div className="mt-6">
        <Suspense fallback={<AnalyzeTextFormSkeleton />}>
          <AnalyzeTextForm />
        </Suspense>
      </div>
    </main>
  );
}
