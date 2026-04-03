"use client";

import { useState } from "react";
import { Download, ArrowUpDown } from "lucide-react";

interface ResultTableProps {
  data: Record<string, any>[];
  executionTimeMs?: number;
}

export default function ResultTable({ data, executionTimeMs }: ResultTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  if (!data || data.length === 0) {
    return <div className="text-gray-500 italic p-4 text-sm font-sans bg-gray-50 dark:bg-gray-800/30 rounded-md border border-gray-200 dark:border-gray-800 my-4">No results found.</div>;
  }

  const columns = Object.keys(data[0]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const exportCSV = () => {
    const csvRows = [];
    csvRows.push(columns.join(','));
    for (const row of sortedData) {
      const values = columns.map(col => {
        const value = row[col] === null ? '' : String(row[col]);
        return `"${value.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'query_results.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white dark:bg-gray-900 my-4 font-sans shadow-sm">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 font-medium">
          {data.length} row{data.length !== 1 ? 's' : ''} {executionTimeMs !== undefined && `• ${executionTimeMs}ms`}
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-primary-light hover:text-primary-dark transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 sticky top-0 uppercase font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {col}
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedData.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-transparent"
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-mono text-xs">
                    {row[col] !== null ? String(row[col]) : (
                      <span className="text-gray-400 italic">null</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
