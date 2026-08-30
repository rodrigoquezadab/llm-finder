@echo off
title LLM Atlas
cd /d "%~dp0"

echo ==========================================
echo       Iniciando LLM Atlas...
echo ==========================================

where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080
  py -m http.server 8080
  goto end
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080
  python -m http.server 8080
  goto end
)

where node >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080
  node -e "const http=require('http'),fs=require('fs'),path=require('path');const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json'};http.createServer((req,res)=>{let p=path.join(__dirname,req.url==='/'?'index.html':req.url);if(fs.existsSync(p)&&fs.statSync(p).isFile()){res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'text/plain'});fs.createReadStream(p).pipe(res);}else{res.writeHead(404);res.end('Not Found');}}).listen(8080,()=>console.log('Servidor en http://localhost:8080'));"
  goto end
)

echo.
echo [ERROR] No se encontro Python ni Node.js.
echo Instala Python o Node.js para ejecutar el servidor local.
echo.
pause

:end
