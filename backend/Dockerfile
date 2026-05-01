FROM python:3.11

WORKDIR /app

# Install system dependencies for SSL
RUN apt-get update && apt-get install -y \
    ca-certificates \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 7860

# Run the application
CMD ["python", "main.py"]
