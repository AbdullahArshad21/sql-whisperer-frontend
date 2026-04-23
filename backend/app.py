import os
import json
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="SQL Whisperer API",
    description="FastAPI backend for generating and executing SQL queries",
    version="1.0.0"
)

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request bodies
class GenerateSqlRequest(BaseModel):
    question: str
    schema: str

class ExecuteQueryRequest(BaseModel):
    sql: str
    supabase_url: str
    supabase_key: str

@app.get("/health")
async def health_check():
    """
    Health check endpoint to ensure the API is running correctly.
    """
    return {"status": "ok"}

@app.post("/generate-sql")
async def generate_sql(request: GenerateSqlRequest):
    """
    Endpoint to generate a SQL query based on a natural language question and database schema.
    Uses the Groq API with the llama3-70b-8192 model.
    """
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY environment variable is not set")
    
    try:
        # Initialize Groq client
        groq_client = Groq(api_key=api_key)
        
        # Prepare the prompt for the Llama3 model
        prompt = f"""
Given the following database schema representing the structure of our database:
{request.schema}

Write a valid SQL query to answer the following question:
{request.question}

Return ONLY a JSON object with two keys:
1. "sql": the raw SQL query string (ready to execute)
2. "explanation": a concise explanation of how the query works

Ensure your response is valid parseable JSON.
"""
        completion = groq_client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a senior database architect that writes highly optimized SQL queries."},
                {"role": "user", "content": prompt}
            ],
            # Use JSON mode for guaranteed JSON output
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        # Parse output
        response_content = completion.choices[0].message.content
        result = json.loads(response_content)
        
        return {
            "sql": result.get("sql", ""),
            "explanation": result.get("explanation", "")
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse the response from the LLM model as JSON.")
    except Exception as e:
        # Catch-all for API errors (e.g. rate limits, network issues)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/execute-query")
async def execute_query(request: ExecuteQueryRequest):
    """
    Endpoint to execute an arbitrary SQL query against a Supabase PostgreSQL database.
    """
    start_time = time.time()
    
    try:
        # Initialize Supabase client with the provided credentials
        supabase: Client = create_client(request.supabase_url, request.supabase_key)
        
        # IMPORTANT NOTE on raw SQL execution with Supabase python SDK (PostgREST API):
        # The Supabase REST API does not natively support running arbitrary "raw" SQL strings.
        # To make this work via PostgREST, you must create an RPC function on your database.
        # 
        # Example SQL to run once in your Supabase SQL Editor:
        # CREATE OR REPLACE FUNCTION execute_raw_sql(query text) RETURNS json AS $$
        # DECLARE
        #   result json;
        # BEGIN
        #   EXECUTE 'SELECT json_agg(row) FROM (' || query || ') AS row' INTO result;
        #   RETURN result;
        # END;
        # $$ LANGUAGE plpgsql VOLATILE;
        
        # Call the RPC function with our query
        response = supabase.rpc("execute_raw_sql", {"query": request.sql}).execute()
        
        # Calculate execution time
        end_time = time.time()
        execution_time = round(end_time - start_time, 4)
        
        # Extract rows and columns
        data = response.data if response.data else []
        
        # If data is present, extract columns from the keys of the first row
        columns = list(data[0].keys()) if data and isinstance(data, list) else []
        
        return {
            "rows": data,
            "columns": columns,
            "execution_time": execution_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database execution error: {str(e)}")
