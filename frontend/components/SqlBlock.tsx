"use client";

import { useState } from "react";
import { Check, Copy, Play, HelpCircle } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SqlBlockProps {
  sql: string;
  onRun?: (sql: string) => void;
  onExplain?: (sql: string) => void;
}

export default function SqlBlock({ sql, onRun, onExplain }: SqlBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-md overflow-hidden bg-[#1E1E1E] border border-gray-800 my-4 text-sm font-mono shadow-sm">
      <div className="flex justify-between items-center bg-gray-900 px-4 py-2 border-b border-gray-800">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">SQL</span>
        <div className="flex gap-2">
          {onExplain && (
            <button
              onClick={() => onExplain(sql)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-light transition-colors"
            >
              <HelpCircle size={14} />
              Explain
            </button>
          )}
          {onRun && (
            <button
              onClick={() => onRun(sql)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors ml-2"
            >
              <Play size={14} />
              Run
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors ml-2"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div className="p-0">
        <SyntaxHighlighter
          language="sql"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '14px',
          }}
          codeTagProps={{
            className: 'font-mono'
          }}
        >
          {sql}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
