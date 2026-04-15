#!/bin/bash

echo "🚀 Starting E-Disposisi System..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $1 is already in use"
        return 1
    fi
    return 0
}

# Start backend
if check_port 8080; then
    echo "🔧 Starting backend server..."
    export PATH=$HOME/go/bin:$PATH
    cd simple-backend
    go run main.go &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started on http://localhost:8080"
else
    echo "⚠️  Backend port 8080 in use, skipping..."
fi

# Start frontend (simple HTTP server)
if check_port 3010; then
    echo "🎨 Starting frontend server..."
    python3 -m http.server 3010 &
    FRONTEND_PID=$!
    echo "✅ Frontend started on http://localhost:3010"
else
    echo "⚠️  Frontend port 3010 in use, skipping..."
fi

echo ""
echo "🎉 System is running!"
echo "🌐 Frontend: http://localhost:3010 (index.html)"
echo "🔗 Backend API: http://localhost:8080"
echo ""
echo "Available endpoints:"
echo "  GET  /api/health"
echo "  POST /api/login"
echo "  GET  /api/disposisi/monitoring"
echo "  POST /api/disposisi"
echo "  POST /api/laporan"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait