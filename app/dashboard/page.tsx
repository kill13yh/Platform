import { Suspense } from 'react';
import {
  fetchTextAnalysisCount,
  fetchIpCheckCount,
  fetchVirusScanCount,
  fetchLatestTextAnalyses
} from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';
import AnalyzeTextForm from '@/app/ui/dashboard/AnalyzeTextForm';

export default async function DashboardPage() {
  const [
    textAnalysisCount,
    ipCheckCount,
    virusScanCount,
    latestAnalyses
  ] = await Promise.all([
    fetchTextAnalysisCount(),
    fetchIpCheckCount(),
    fetchVirusScanCount(),
    fetchLatestTextAnalyses()
  ]);

  return (
    <main className="p-4">
      <h1 className={`${lusitana.className} mb-6 text-3xl font-bold`}>
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            Text Analyses
          </h2>
          <p className="text-3xl font-bold">{textAnalysisCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500 mb-2">IP Checks</h2>
          <p className="text-3xl font-bold">{ipCheckCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            Virus Scans
          </h2>
          <p className="text-3xl font-bold">{virusScanCount}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className={`${lusitana.className} mb-4 text-2xl font-semibold`}>
          Latest Text Analyses
        </h2>
        <Suspense fallback={<p>Loading analyses...</p>}>
          <AnalyzeTextForm latestAnalyses={latestAnalyses} />
        </Suspense>
      </section>
    </main>
  );
}
