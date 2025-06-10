// app/ui/skeletons.tsx

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

/**
 * Карточка загрузки (Card)
 */
export function CardSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}>
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

/**
 * Скелетон для нескольких карточек (например, статистики)
 */
export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function SecurityPanelSkeleton() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}


/**
 * Скелетон для формы анализа текста (AnalyzeTextForm)
 */
export function AnalyzeTextFormSkeleton() {
  return (
    <div className={`${shimmer} relative flex w-full flex-col overflow-hidden rounded-xl bg-gray-100 p-6`}>
      <div className="h-6 w-1/3 mb-4 rounded bg-gray-300"></div>
      <div className="h-32 w-full rounded bg-gray-200"></div>
      <div className="mt-4 h-10 w-24 rounded bg-gray-300"></div>
    </div>
  );
}

export function LatestAlertsSkeleton() {
  return (
    <div className={`${shimmer} relative flex w-full flex-col overflow-hidden rounded-xl bg-gray-100 p-4`}>
      <div className="mb-4 h-6 w-1/3 rounded bg-gray-300"></div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

export function RevenueChartSkeleton() {
  return <div className={`${shimmer} h-[350px] w-full rounded-xl bg-gray-100`} />;
}

/**
 * Основной скелетон для дашборда
 */
export default function DashboardSkeleton() {
  return (
    <>
      <div className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6">
        <AnalyzeTextFormSkeleton />
      </div>
    </>
  );
}
