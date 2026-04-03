import Link from "next/link";
import { Database, Zap, Clock, History, BrainCircuit, PlayCircle, BarChart3, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Database className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
              SQL Whisperer
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
              Log in
            </Link>
            <Link href="/login" className="text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 border border-primary/20">
            <Zap size={14} className="text-primary" />
            <span>Powered by StarCoder2 & Llama 3</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl">
             Ask your database <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">anything</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
            Stop writing complex SQL queries manually. Just ask your question in plain English, and our AI will generate, run, and visualize the results instantly.
          </p>

          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex gap-2 mb-8 relative z-10 transition-transform hover:scale-[1.01] duration-300">
            <input
              type="text"
              placeholder="e.g. Show me all users who signed up last week..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-gray-900 dark:text-white text-base"
            />
            <Link href="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm">
              Try it free
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-24">
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-primary" size={24} />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">llama3-70b-8192</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-0.5">Model Powered</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-primary" size={24} />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">&lt;800ms response</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-0.5">Lightning Fast</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Database className="text-primary" size={24} />
              <div>
                <div className="font-bold text-gray-900 dark:text-white">3 DB types supported</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-0.5">Postgres, MySQL, Sqlite</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Everything you need to talk to your data
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for speed, accuracy, and ease of use. SQL Whisperer understands your schema and your intent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Schema-aware AI</h3>
              <p className="text-gray-600 dark:text-gray-400">
                The AI automatically learns your database schema, ensuring the generated queries are accurate and use the correct tables and columns.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <PlayCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Live execution</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Review the generated SQL, then execute it directly within the app. See results in a beautiful, sortable table and export to CSV instantly.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <History className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Query history</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Never lose a good query again. All your past questions and their generated SQL are saved in your history for quick reference.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Database className="text-gray-400" size={20} />
          <span className="font-bold text-gray-900 dark:text-white">SQL Whisperer</span>
        </div>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} SQL Whisperer. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
