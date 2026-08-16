# SQL Whisperer 🪄

Write what you want in plain English — get back a real, ready-to-run SQL query.

SQL Whisperer turns natural-language questions ("show me the top 5 customers by revenue last month") into valid SQL for your database, using an LLM under the hood. Paste in your schema, ask your question, and it generates the query plus a plain-English explanation of how it works — with the option to run it directly against a connected Supabase database.

**Live demo:** [sql-whisperer-frontend-gules.vercel.app](https://sql-whisperer-frontend-gules.vercel.app)

---

## How it works

1. **Describe your query** in plain English and provide your database schema.
2. The **backend** sends your question + schema to an LLM (via Groq, running Llama 3), which returns SQL and an explanation.
3. Optionally, **execute** the generated SQL directly against your Supabase Postgres database and see the results.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python) |
| LLM | Groq API (Llama 3.1) |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Backend hosting | Docker container (Hugging Face Spaces–ready) |
| Frontend hosting | Vercel |

## Project structure

```
sql-whisperer-frontend/
├── backend/            # FastAPI service
│   ├── app.py          # /generate-sql and /execute-query endpoints
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # Next.js app
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/              # Auth page
│   │   ├── dashboard/           # Main query UI
│   │   └── api/query/           # Server route that proxies to the backend
│   └── lib/supabase.ts          # Supabase client
└── schema.sql            # Database schema & migrations for the app's own Supabase project
```

## Getting started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A [Groq API key](https://console.groq.com)
- A [Supabase](https://supabase.com) project

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```
GROQ_API_KEY=your_groq_api_key
```

Run the API:

```bash
uvicorn app:app --reload --port 7860
```

Endpoints:
- `GET /health` — health check
- `POST /generate-sql` — body: `{ "question": "...", "schema": "..." }` → returns `{ sql, explanation }`
- `POST /execute-query` — body: `{ "sql": "...", "supabase_url": "...", "supabase_key": "..." }` → runs the query against a Supabase project via an `execute_raw_sql` RPC function (see comments in `app.py` for the SQL to create it)

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
HF_API_URL=http://localhost:7860/generate-sql
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 3. Database

Run `schema.sql` in your Supabase project's SQL editor to set up the `profiles`, `connections`, and `query_history` tables used by the app.

## Deployment

- **Backend**: containerized with the included `Dockerfile`, built to run on Hugging Face Spaces (binds to `0.0.0.0:7860`) — deployable anywhere Docker runs.
- **Frontend**: deployed on Vercel; the `HF_API_URL` env var should point at your deployed backend's `/generate-sql` endpoint.

## Security note

The `execute-query` endpoint accepts Supabase credentials and arbitrary SQL from the client and executes it via an RPC function. Treat this as a development/demo pattern — for production use, add SQL validation, scoped/read-only database roles, and proper auth before exposing this to untrusted input.

## License

No license specified.
