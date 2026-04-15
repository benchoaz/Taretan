#!/bin/bash

# E-Disposisi Setup Script

echo "🚀 Setting up E-Disposisi System..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create database
echo "📦 Creating database..."
sudo -u postgres createdb edisposisi 2>/dev/null || echo "Database already exists"

# Run migration
echo "🔄 Running database migration..."
psql -U postgres -d edisposisi -f database/schema.sql

# Run seeder
echo "🌱 Running database seeder..."
psql -U postgres -d edisposisi -f database/seeder.sql

echo "✅ Database setup complete!"

# Setup backend
echo "🔧 Setting up backend..."
cd backend
if command -v go &> /dev/null; then
    go mod tidy
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Go not found. Please install Go 1.21+ manually"
fi

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../frontend
if command -v npm &> /dev/null; then
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Node.js not found. Please install Node.js 18+ manually"
fi

echo ""
echo "🎉 Setup complete! To start the system:"
echo "1. Start backend: cd backend && go run cmd/server/main.go"
echo "2. Start frontend: cd frontend && npm start"
echo "3. Open browser: http://localhost:3000"
echo ""
echo "Default login:"
echo "Email: admin@disposisi.go.id"
echo "Password: password (note: this is demo, change in production)"