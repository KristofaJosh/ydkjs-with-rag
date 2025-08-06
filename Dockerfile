# Multi-stage build for YDKJS Reader application

# Stage 1: Build the NextJS frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY client/package.json client/pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the frontend code
COPY client/ ./

# Build the NextJS application
RUN pnpm build

# Stage 2: Base server with Python dependencies
FROM python:3.11-slim AS base-server

# Set working directory
WORKDIR /app

# Copy just the requirements.txt first for better layer caching
COPY server/requirements.txt /app/server/

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r /app/server/requirements.txt

# Copy the rest of the Python backend
COPY server/ /app/server/

# Create directories for persistent data
RUN mkdir -p /app/server/chroma_db

# Stage 3: Final image with Ollama, Python, and Node.js
FROM ollama/ollama AS ollama-runtime

# Install Python and other necessary packages
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv curl gnupg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x and pnpm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    npm install -g pnpm && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/client /app/client

# Copy backend requirements and create a virtual environment
COPY --from=base-server /app/server/requirements.txt /app/server/
RUN python3 -m venv /app/venv
# Install Python dependencies in the virtual environment
RUN /app/venv/bin/pip install --no-cache-dir -r /app/server/requirements.txt

# Copy backend source code
COPY --from=base-server /app/server/ /app/server/

# Create directories for persistent data
RUN mkdir -p /app/server/chroma_db

# Models will be pulled when the container starts

# Expose ports
EXPOSE 11434 3000 8000

# Startup script
RUN echo '#!/bin/bash\n\
ollama serve &\n\
sleep 5\n\
# Pull required models\n\
ollama pull gemma:2b\n\
ollama pull nomic-embed-text\n\
cd /app/server && /app/venv/bin/python -m uvicorn entry:app --host 0.0.0.0 --port 8000 &\n\
cd /app/client && pnpm start\n\
' > /app/start.sh && chmod +x /app/start.sh

ENTRYPOINT ["/app/start.sh"]