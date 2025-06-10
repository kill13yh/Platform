import { createTextAnalysis } from '@/app/lib/actions';
import { fetchLatestTextAnalyses } from '@/app/lib/data';
import { TextAnalysisResult } from '@/app/lib/definitions';
import clsx from 'clsx';

export const runtime = 'nodejs';

export default async function TextAnalysesPage() {
  const latestAnalyses: TextAnalysisResult[] = await fetchLatestTextAnalyses();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Text Analyses</h1>

      {/* Форма отправки текста */}
      <form
        action={createTextAnalysis}
        className="mb-6 space-y-4"
      >
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">
            Text to Analyze
          </label>
          <textarea
            id="text"
            name="text"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <input type="hidden" name="isToxic" value="false" />

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Latest Analyses</h2>
      {latestAnalyses.length === 0 ? (
        <p className="text-gray-500">No analyses found.</p>
      ) : (
        <ul className="space-y-2">
          {latestAnalyses.map((item) => (
            <li
              key={item.uuid}
              className="flex justify-between items-center border p-2 rounded-md"
            >
              <span className="truncate">{item.text.slice(0, 30)}...</span>
              <span
                className={clsx('text-sm font-semibold', {
                  'text-red-500': item.isToxic,
                  'text-green-500': !item.isToxic,
                })}
              >
                {item.isToxic ? 'Toxic' : 'Clean'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
