#!/bin/bash
export PATH="/home/beni/Zimpen/node-v18.20.8-linux-x64/bin:$PATH"
export GO111MODULE=on
# E-Disposisi Run Script

echo "🚀 Starting E-Disposisi System..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    fi
    return 0
}

# Start backend
if check_port 8080; then
    echo "🔧 Starting backend server..."
    cd backend
    go run cmd/server/main.go &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started on http://localhost:8080"
else
    echo "⚠️  Backend port 8080 in use, skipping..."
fi

# Start frontend
if check_port 3010; then
    echo "🎨 Starting frontend server..."
    cd frontend
    PORT=3010 npm start &
    FRONTEND_PID=$!
    cd ..
    echo "✅ Frontend started on http://localhost:3010"
else
    echo "⚠️  Frontend port 3010 in use, skipping..."
fi

echo ""
echo "🎉 System is running!"
echo "📱 Frontend: http://localhost:3010"
echo "🔗 Backend API: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait