import { fetchTextAnalysisCount, fetchIpCheckCount, fetchVirusScanCount } from '@/app/lib/data';
import { ShieldCheckIcon, GlobeAltIcon, BugAntIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const iconMap = {
  text: ShieldCheckIcon,
  ip: GlobeAltIcon,
  virus: BugAntIcon,
};

type StatType = keyof typeof iconMap;

function StatCard({ title, value, type }: { title: string; value: number; type: StatType }) {
  const Icon = iconMap[type];
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon && <Icon className="h-5 w-5 text-gray-700" />}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}>
        {value}
      </p>
    </div>
  );
}

export async function SecurityPanel() {
  const [textCount, ipCount, virusCount] = await Promise.all([
    fetchTextAnalysisCount(),
    fetchIpCheckCount(),
    fetchVirusScanCount(),
  ]);

  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      <StatCard title="Text Analyses" value={textCount} type="text" />
      <StatCard title="IP Checks" value={ipCount} type="ip" />
      <StatCard title="Virus Scans" value={virusCount} type="virus" />
    </div>
  );
}