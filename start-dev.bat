@echo off
REM Startar BrewCoff lokalt: backend (Stripe) + frontend. Dubbelklicka for att köra.
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js saknas - installera fran https://nodejs.org & pause & exit /b 1)
if not exist "server\.env" (echo server\.env saknas - kopiera server\.env.example och fyll i STRIPE_SECRET_KEY & pause & exit /b 1)
if not exist "server\node_modules" (echo Installerar backend-paket... & pushd server & call npm install & popd)
if not exist "node_modules" (echo Installerar frontend-paket... & call npm install)
start "BrewCoff backend (Stripe)" /d "%~dp0server" cmd /k npm run dev
start "BrewCoff frontend" /d "%~dp0" cmd /k npm run dev -- --open
echo Startat! Tva fonster oppnades. Stang dem for att stoppa servrarna.
timeout /t 5 >nul
