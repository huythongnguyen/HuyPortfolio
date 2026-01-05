#!/bin/bash
# Bash wrapper for the Python server with cache-busting

echo -e "\n🔧 Starting portfolio server with cache-busting...\n"

# Check if Python is available
if command -v python3 &> /dev/null; then
    python3 serve.py "$@"
elif command -v python &> /dev/null; then
    python serve.py "$@"
else
    echo "❌ Python not found. Please install Python 3.x"
    exit 1
fi
