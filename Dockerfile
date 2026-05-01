FROM python:3.11

WORKDIR /app

# Install system dependencies for SSL and update certificates
RUN apt-get update && apt-get install -y \
    ca-certificates \
    openssl \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set SSL certificate environment variables
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend application code
COPY backend/*.py .
COPY backend/.env.example .env.example

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 7860

# Run the application
CMD ["python", "main.py"]
