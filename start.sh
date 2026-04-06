#!/bin/bash

# FitFloor E-Commerce - Quick Start Script
# Starts backend and main app in different terminal windows/tabs

echo "🚀 FitFloor E-Commerce Platform"
echo "================================"
echo ""

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo -e "${BLUE}✓ Node.js $(node -v)${NC}"
echo ""

# Function to start a service in a new terminal
start_service() {
    local name=$1
    local dir=$2
    local command=$3
    
    echo -e "${GREEN}Starting ${name}...${NC}"
    
    # Check if directory exists
    if [ ! -d "$dir" ]; then
        echo -e "${YELLOW}Error: $dir not found${NC}"
        return 1
    fi
    
    # Install npm dependencies if this folder has package.json
    if [ -f "$dir/package.json" ] && [ ! -d "$dir/node_modules" ]; then
        echo "  📦 Installing dependencies..."
        (cd "$dir" && npm install > /dev/null 2>&1)
    fi
    
    # Open in new terminal based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell application \"Terminal\" to do script \"cd '$dir' && $command\""
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd '$dir' && $command; bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd '$dir' && $command; bash" &
        fi
    fi
}

echo "Opening services in new terminal tabs..."
echo ""

# Start backend server (Laravel)
start_service "Backend API (Laravel, port 4000)" "./laravel-app" "php artisan serve --host=127.0.0.1 --port=4000"
sleep 2

# Start main frontend app
start_service "Store App (port 5173)" "." "npm run dev"
sleep 2

echo ""
echo -e "${GREEN}✓ All services started!${NC}"
echo ""
echo "📱 Apps are running at:"
echo "  • Store: ${BLUE}http://localhost:5173${NC}"
echo "  • API:   ${BLUE}http://localhost:4000${NC}"
echo ""
echo "To stop all services, close the terminal windows."
