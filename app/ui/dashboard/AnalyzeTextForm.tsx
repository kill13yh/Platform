'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';

export default function AnalyzeTextForm() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Analyze error:', err);
      setError('Failed to analyze text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-md">
      <h2 className={`${lusitana.className} mb-4 text-lg font-semibold`}>
        Analyze Text
      </h2>
      <form onSubmit={handleAnalyze} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for analysis..."
          className="w-full rounded-md border border-gray-300 p-2"
          rows={4}
          required
        />
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500">
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </form>

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}

      {result && (
        <div className="mt-4 p-4 rounded bg-white shadow">
          <h3 className="font-medium">Analysis Result:</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
