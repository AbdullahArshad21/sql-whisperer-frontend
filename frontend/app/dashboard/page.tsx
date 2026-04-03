"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database, LogOut, Send, Search, Table2, History, Plus, Loader2 } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import SqlBlock from "@/components/SqlBlock";
import ResultTable from "@/components/ResultTable";

const SUGGESTIONS = [
  "Show me the top 5 customers by revenue",
  "How many new users signed up this week?",
  "List out the most expensive products",
  "Which department has the most employees?"
];

// Mock Schema for the sidebar
const MOCK_TABLES = [
  { name: "users", columns: ["id", "email", "created_at"] },
  { name: "orders", columns: ["id", "user_id", "total", "status", "created_at"] },
  { name: "products", columns: ["id", "name", "price", "stock"] },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSubmit = async (e?: React.FormEvent, overwriteVal?: string) => {
    e?.preventDefault();
    const queryStr = overwriteVal || inputVal;
    if (!queryStr.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: queryStr }];
    setMessages(newMessages);
    setInputVal("");
    setIsQuerying(true);

    try {
      // Setup payload for our API
      const schemaString = MOCK_TABLES.map(t => `Table ${t.name}: ${t.columns.join(', ')}`).join('\\n');
      
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: queryStr, schema: schemaString }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate query");
      }

      setMessages(prev => [...prev, {
        role: "ai", 
        content: `Here is the SQL query for your request:`,
        sql: data.sql,
        // Optional mock data for the UI so they have something to see before hitting run
      }]);

    } catch (err: any) {
      setMessages(prev => [...prev, { role: "ai", content: `Error: ${err.message}` }]);
    } finally {
      setIsQuerying(false);
    }
  };

  const executeSql = async (sql: string, messageIndex: number) => {
    // In a real app we'd call an execution endpoint. 
    // Here we'll mock it for the demo with generic data based on the tables.
    setMessages(prev => {
      const clone = [...prev];
      clone[messageIndex] = {
        ...clone[messageIndex],
        executing: true
      };
      return clone;
    });

    setTimeout(() => {
      setMessages(prev => {
        const clone = [...prev];
        clone[messageIndex] = {
          ...clone[messageIndex],
          executing: false,
          results: {
            data: [
              { id: 1, name: "Alice", email: "alice@example.com" },
              { id: 2, name: "Bob", email: "bob@example.com" }
            ],
            timeMs: 124
          }
        };
        return clone;
      });
    }, 800);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <aside className="w-[260px] flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Database className="text-primary" size={20} />
          <span className="font-bold text-gray-900 dark:text-white">SQL Whisperer</span>
        </div>
        
        <div className="p-3">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium transition shadow-sm"
          >
            <Plus size={16} />
            New Query
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-1 py-2">
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <Table2 size={14} /> Schema
            </h3>
            <div className="space-y-1 px-2">
              {MOCK_TABLES.map(table => (
                <div key={table.name} className="group">
                  <div className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded flex justify-between items-center cursor-pointer">
                    <span>{table.name}</span>
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100">{table.columns.length} cols</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <History size={14} /> History
            </h3>
            <div className="space-y-1 px-2">
              <div className="px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded truncate cursor-pointer transition">
                Top 5 customers
              </div>
              <div className="px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded truncate cursor-pointer transition">
                New users today
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-sm">
          <div className="font-medium text-gray-900 dark:text-white truncate mb-3">
            {user?.email}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors w-full"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Database className="text-primary" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Talk to your database
              </h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Ask questions using plain English. Our AI will analyze your schema and generate the correct SQL query in seconds.
              </p>
            </div>
          ) : (
            <div className="pb-32 pt-6">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role}>
                  <div>{msg.content}</div>
                  {msg.sql && (
                    <SqlBlock 
                      sql={msg.sql} 
                      onRun={(sql) => executeSql(sql, idx)}
                    />
                  )}
                  {msg.executing && (
                     <div className="flex items-center gap-2 text-sm text-gray-500 italic mt-2">
                       <Loader2 className="animate-spin" size={14} /> Executing query...
                     </div>
                  )}
                  {msg.results && (
                    <ResultTable data={msg.results.data} executionTimeMs={msg.results.timeMs} />
                  )}
                </ChatMessage>
              ))}
              {isQuerying && (
                <ChatMessage role="ai">
                  <div className="flex items-center gap-2 text-gray-500">
                     <span className="flex gap-1">
                       <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                       <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                       <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                     </span>
                     <span>Generating SQL...</span>
                  </div>
                </ChatMessage>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-950 dark:via-gray-950 dark:to-transparent pb-8">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(undefined, suggestion)}
                    className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:border-primary hover:text-primary transition shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <form 
              onSubmit={handleSubmit}
              className="relative bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition overflow-hidden p-1 flex items-end"
            >
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputVal.trim()) handleSubmit(e);
                  }
                }}
                placeholder="Ask a question about your data..."
                className="w-full bg-transparent border-none outline-none resize-none px-4 py-3 text-gray-900 dark:text-white min-h-[56px] max-h-32"
                rows={1}
              />
              <button 
                type="submit"
                disabled={!inputVal.trim() || isQuerying}
                className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-lg mb-1 mr-1 transition disabled:opacity-50 disabled:hover:bg-primary flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="text-center mt-2 text-xs text-gray-400">
              SQL Whisperer can make mistakes. Consider verifying important queries.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
