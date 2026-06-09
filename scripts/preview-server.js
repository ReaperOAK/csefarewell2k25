/**
 * Local preview server that mirrors firebase.json hosting rewrites against the
 * static export in out/. Lets you test /invitation/<anyId> and /amp-story/<anyId>
 * exactly as production behaves (single shell + client-side id from the URL).
 * Run: node scripts/preview-server.js   (after `npm run build`)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'out');
const PORT = process.env.PORT || 4000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.txt': 'text/plain',
};

function send(res, file) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

function resolve(urlPath) {
  // Strip query, decode (handles spaces in asset filenames)
  let p = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [];
  if (p === '/' || p === '') candidates.push('index.html');
  candidates.push(p.replace(/^\//, ''));            // exact file
  candidates.push(p.replace(/^\//, '') + '.html');  // cleanUrls: /invitation -> invitation.html
  candidates.push(path.join(p.replace(/^\//, ''), 'index.html'));
  for (const c of candidates) {
    const f = path.join(ROOT, c);
    if (f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

const server = http.createServer((req, res) => {
  let file = resolve(req.url);
  if (!file) {
    // Mirror firebase.json rewrites: dynamic shells + SPA fallback
    if (req.url.startsWith('/invitation/')) file = path.join(ROOT, 'invitation/1.html');
    else if (req.url.startsWith('/amp-story/')) file = path.join(ROOT, 'amp-story/1.html');
    else file = path.join(ROOT, 'index.html');
  }
  if (fs.existsSync(file)) send(res, file);
  else { res.writeHead(404); res.end('Not found'); }
});

server.listen(PORT, () => {
  console.log(`\n  Preview (production rewrites) ready:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Invites: http://localhost:${PORT}/invitation/<firebaseDocId>\n`);
});
