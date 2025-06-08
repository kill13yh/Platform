import CardWrapper from '@/app/ui/dashboard/TextAnalyzerCard';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import AnalyzeTextForm from '@/app/ui/dashboard/TextAnalyzerCard';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data'; // Remove fetchAnalyzeTextForm
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  AnalyzeTextFormSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
 
export default async function Page() {
  // Remove `const AnalyzeTextForm = await fetchAnalyzeTextForm()`
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
 
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<AnalyzeTextFormSkeleton />}>
          <AnalyzeTextForm />
        </Suspense>
      </div>
    </main>
  );
}