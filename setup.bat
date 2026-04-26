@echo off
echo Setting up FindChildd Project...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.9 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

echo Python and Node.js found

REM Setup Backend
echo.
echo Setting up Backend...
cd backend

REM Create virtual environment
python -m venv venv
echo Virtual environment created

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
pip install -r requirements.txt
echo Backend dependencies installed

REM Create .env if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please edit it with your API keys.
)

cd ..

REM Setup Frontend
echo.
echo Setting up Frontend...
cd frontend

REM Install dependencies
call npm install
echo Frontend dependencies installed

REM Create .env.local if it doesn't exist
if not exist .env.local (
    copy .env.local.example .env.local
    echo Created .env.local file
)

cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your API keys (MongoDB, OpenAI, WhatsApp)
echo 2. Start MongoDB if using local instance
echo 3. Run backend: cd backend ^&^& venv\Scripts\activate ^&^& python main.py
echo 4. Run frontend: cd frontend ^&^& npm run dev
echo.
echo See SETUP.md for detailed instructions
pause
