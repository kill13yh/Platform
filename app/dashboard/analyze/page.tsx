'use client';
import { useState } from 'react';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ text }),
    });
    const json = await res.json();
    setResult(json);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl">Text Analysis</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
        className="w-full border p-2 mt-4"
      />
      <button
        onClick={handleAnalyze}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Analyze
      </button>

      {result && (
        <div className="mt-6 p-4 border bg-gray-100">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
