'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { TextAnalysisResult } from '@/app/lib/definitions';

export default function AnalyzeTextForm({
  latestAnalyses
}: {
  latestAnalyses?: TextAnalysisResult[];  // Добавим ? чтобы сделать latestAnalyses необязательным
}) {
  const analyses = latestAnalyses ?? [];  // Используем пустой массив как запасной вариант

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Text Analyses
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {analyses.map((item: TextAnalysisResult, i: number) => (
            <div
              key={`${item.id || i}`}
              className={clsx(
                'flex flex-row items-center justify-between py-4',
                { 'border-t': i !== 0 }
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold md:text-base">
                  {item.text?.slice(0, 20) || 'No Text'}
                </p>
                <p className="hidden text-sm text-gray-500 sm:block">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <p
                className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
              >
                {item.isToxic ? 'Toxic' : 'Clean'}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
