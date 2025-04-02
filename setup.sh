#!/bin/bash

# Test trigger for GitHub Actions
echo "🚀 Setting up CurioPay development environment..."

# Generate random NEXTAUTH_SECRET if needed
generate_secret() {
    openssl rand -hex 16
}

# Function to prompt for optional values
prompt_value() {
    local prompt=$1
    local default=$2
    local value
    read -r -p "Enter $prompt (default: $default): " value
    echo "${value:-$default}"
}

# Create .env file with interactive prompts
create_env() {
    echo "🔧 Configuring environment variables..."
    echo "Press Enter to use default values or input your own."

    # Required defaults
    cat > .env << EOF
# System Defaults (Do not change)
DATABASE_URL='postgresql://postgres:postgres@db:5432/curiopay'
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=$(generate_secret)
CRON_SECRET=$(generate_secret)

# Optional Services (Configure as needed)
EOF

    # Optional services prompts
    echo "📧 Email Configuration"
    SMTP_HOST=$(prompt_value "SMTP host" "smtp.gmail.com")
    SMTP_PORT=$(prompt_value "SMTP port" "587")
    SMTP_USER=$(prompt_value "SMTP user" "")
    SMTP_PASS=$(prompt_value "SMTP password" "")
    SMTP_FROM=$(prompt_value "SMTP from address" "$SMTP_USER")

    echo "Storage Configuration"
    BLOB_TOKEN=$(prompt_value "Blob storage token" "")

    echo "Sentry Configuration"
    SENTRY_DSN=$(prompt_value "Sentry DSN" "")

    # Append optional configurations
    cat >> .env << EOF
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
SMTP_FROM=$SMTP_FROM
BLOB_READ_WRITE_TOKEN=$BLOB_TOKEN
SENTRY_DSN=$SENTRY_DSN
EOF

    echo "✅ Created .env file with your configurations"
}

# Initialize project dependencies and database
init_project() {
    echo "📦 Installing dependencies..."
    npm install

    echo "🔄 Setting up database..."
    if [ ! -d "node_modules/prisma" ]; then
        npm install prisma@6.0.1 --save-dev
    fi

    echo "🐳 Starting database container..."
    docker-compose up db -d

    echo "⏳ Waiting for database to be ready..."
    until docker-compose exec -T db pg_isready; do
        echo "Waiting for database..."
        sleep 2
    done

    echo "🔧 Initializing database..."
    # Super user setup and database creation
    docker-compose exec -T db psql -U postgres -c "DROP DATABASE IF EXISTS curiopay;"
    docker-compose exec -T db psql -U postgres -c "CREATE DATABASE curiopay;"
    docker-compose exec -T db psql -U postgres -d curiopay -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
    docker-compose exec -T db psql -U postgres -d curiopay -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;"
    docker-compose exec -T db psql -U postgres -d curiopay -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;"
    docker-compose exec -T db psql -U postgres -d curiopay -c "GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;"
    
    echo "🔄 Running Prisma setup..."
    npx prisma generate
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/curiopay" npx prisma migrate dev --name init --schema ./prisma/schema.prisma --create-only
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/curiopay" npx prisma migrate deploy --schema ./prisma/schema.prisma

    echo "✅ Database setup complete!"

    # Stop the database container - it will be restarted with all services
    docker-compose down
}

# Check if .env exists
if [ -f .env ]; then
    read -r -p "⚠️  .env file already exists. Do you want to recreate it? (y/N) " answer
    if [[ $answer =~ ^[Yy]$ ]]; then
        create_env
    fi
else
    create_env
fi

# Modified final section
if [ -d "prisma/migrations" ]; then
    echo "🚀 Starting all services..."
    docker-compose up --build -d
    echo "⏳ Waiting for services to be ready..."
    sleep 5
    echo "✅ Setup complete!"
    echo "🌐 Application is running at http://localhost:3000"
    echo "✨ Prisma Studio is available at http://localhost:5555"
else
    init_project
    echo "🔄 Restarting with all services..."
    docker-compose up --build -d
    echo "✅ Setup complete!"
    echo "🌐 Application is running at http://localhost:3000"
    echo "✨ Prisma Studio is available at http://localhost:5555"
fi