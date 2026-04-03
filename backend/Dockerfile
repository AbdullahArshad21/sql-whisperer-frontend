# Use Python 3.10 as the base image for the runtime
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the working directory
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose port 7860 as required by HuggingFace Spaces Docker deployment
EXPOSE 7860

# Run the FastAPI app using Uvicorn
# HuggingFace requires bind to 0.0.0.0 and port 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
