# Multi-stage build for YDKJS Reader application

# Stage 1: Build the NextJS frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package.json client/package-lock.json ./
RUN npm ci

# Copy the rest of the frontend code
COPY client/ ./

# Build the NextJS application
RUN npm run build

# Stage 2: Final image with Python and Node.js
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Copy the built NextJS app
COPY --from=frontend-builder /app/client/.next /app/client/.next
COPY --from=frontend-builder /app/client/public /app/client/public
COPY --from=frontend-builder /app/client/node_modules /app/client/node_modules
COPY --from=frontend-builder /app/client/package.json /app/client/package.json
COPY --from=frontend-builder /app/client/next.config.mjs /app/client/next.config.mjs

# Copy the rest of the NextJS app
COPY client/app /app/client/app
COPY client/components /app/client/components
COPY client/styles /app/client/styles
COPY client/lib /app/client/lib
COPY client/utils /app/client/utils
COPY client/hooks /app/client/hooks

# Copy just the requirements.txt first for better layer caching
COPY server/requirements.txt /app/server/

# Set working directory to the server directory
WORKDIR /app/server

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Python backend
COPY server/ /app/server/

# Create directories for persistent data
RUN mkdir -p /app/server/chroma_db

# Expose ports for the NextJS app and FastAPI server
EXPOSE 3000 8000

# Create a startup script
RUN echo '#!/bin/bash\n\
# Start Ollama in the background\n\
ollama serve &\n\
\n\
# Wait for Ollama to start\n\
sleep 5\n\
\n\
# Pull required Ollama models\n\
ollama pull gemma3:4b\n\
ollama pull nomic-embed-text\n\
\n\
# Start the FastAPI server in the background\n\
cd /app/server\n\
python -m uvicorn entry:app --host 0.0.0.0 --port 8000 &\n\
\n\
# Start the NextJS app\n\
cd /app/client\n\
npm run start\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

# Set the entrypoint
ENTRYPOINT ["/app/start.sh"]