// Исходный код взят из туториала Next.js: https://nextjs.org/learn/dashboard-app
// Ниже пример главного файла страницы (page.tsx), адаптированный под твою тему:

import { lusitana } from '@/app/ui/fonts';
import { RevenueChartSkeleton, LatestAlertsSkeleton, SecurityPanelSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import RevenueChart from '@/app/ui/revenue-chart';
import { LatestAlerts } from '@/app/ui/latest-alerts';
import { SecurityPanel } from '@/app/ui/security-panel';

export default async function Page() {
  return (
    <main className="flex flex-col p-6">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Панель платформы ИИ и криптографической безопасности</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<SecurityPanelSkeleton />}>
          <SecurityPanel />
        </Suspense>
        <Suspense fallback={<LatestAlertsSkeleton />}>
          <LatestAlerts />
        </Suspense>
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Последние инциденты безопасности</h2>
        <Suspense fallback={<LatestAlertsSkeleton />}>
          <LatestAlerts detailed />
        </Suspense>
      </div>
    </main>
  );
}
