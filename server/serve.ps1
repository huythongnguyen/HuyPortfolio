# PowerShell wrapper for the Python server with cache-busting
Write-Host "`n🔧 Starting portfolio server with cache-busting...`n" -ForegroundColor Cyan

# Check if Python is available and run with any provided arguments
if (Get-Command python -ErrorAction SilentlyContinue) {
    python serve.py $args
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    python3 serve.py $args
} else {
    Write-Host "❌ Python not found. Please install Python 3.x" -ForegroundColor Red
    Write-Host "   Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}
