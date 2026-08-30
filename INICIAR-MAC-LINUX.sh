#!/bin/sh
cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  (sleep 1; open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null || true) &
  python3 -m http.server 8080
elif command -v python >/dev/null 2>&1; then
  (sleep 1; open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null || true) &
  python -m http.server 8080
elif command -v node >/dev/null 2>&1; then
  (sleep 1; open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null || true) &
  node -e "const http=require('http'),fs=require('fs'),path=require('path');const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json'};http.createServer((req,res)=>{let p=path.join(__dirname,req.url==='/'?'index.html':req.url);if(fs.existsSync(p)&&fs.statSync(p).isFile()){res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'text/plain'});fs.createReadStream(p).pipe(res);}else{res.writeHead(404);res.end('Not Found');}}).listen(8080,()=>console.log('Servidor en http://localhost:8080'));"
else
  echo "Instala Python 3 o Node.js y vuelve a ejecutar este archivo."
  exit 1
fi
