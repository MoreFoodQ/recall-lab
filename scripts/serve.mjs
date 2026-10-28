import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png' };
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    if (relative.split(/[\\/]/).includes('..')) throw Error('Invalid path');
    let file = path.resolve('site',relative);
    try { await stat(file); } catch { file = path.resolve('public',relative); }
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
