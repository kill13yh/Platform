import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestIpChecks, fetchLatestVirusScans } from '@/app/lib/data';

export async function LatestAlerts({ detailed = false }: { detailed?: boolean }) {
  const limit = detailed ? 10 : 5;
  const [ipChecks, virusScans] = await Promise.all([
    fetchLatestIpChecks(limit),
    fetchLatestVirusScans(limit),
  ]);

  const alerts = [
    ...ipChecks.map((item) => ({
      id: item.id,
      message: `IP ${item.ip}`,
      status: item.malicious ? 'Malicious' : 'Clean',
      date: item.checked_at,
    })),
    ...virusScans.map((item) => ({
      id: item.id,
      message: item.message || item.data.slice(0, 20),
      status: item.infected ? 'Infected' : 'Clean',
      date: item.scanned_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Latest Alerts</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {alerts.map((alert, i) => (
            <div
              key={alert.id}
              className={clsx('flex flex-row items-center justify-between py-4', {
                'border-t': i !== 0,
              })}
            >
              <div className="flex items-center">
                <ExclamationTriangleIcon className="mr-2 h-5 w-5 text-gray-500" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {alert.message}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {new Date(alert.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
                {alert.status}
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