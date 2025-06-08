import { ShieldCheckIcon, GlobeAltIcon, BugAntIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

// Маппинг иконок под задачи проекта
const iconMap = {
  textAnalysis: ShieldCheckIcon,
  ipCheck: GlobeAltIcon,
  virusScan: BugAntIcon,
};

type CardType = 'textAnalysis' | 'ipCheck' | 'virusScan';

export default function TextAnalyzerCardWrapper() {
  // Здесь можно получать статистику из базы или API
  // Для упрощения используем демо-данные
  const totalTextAnalyses = 42;
  const totalIpChecks = 17;
  const totalVirusScans = 8;

  return (
    <>
      <Card title="Text Analyses" value={totalTextAnalyses} type="textAnalysis" />
      <Card title="IP Checks" value={totalIpChecks} type="ipCheck" />
      <Card title="Virus Scans" value={totalVirusScans} type="virusScan" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: CardType;
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon && <Icon className="h-5 w-5 text-gray-700" />}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
