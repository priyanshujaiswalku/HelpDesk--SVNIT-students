const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize path and remove leading slash
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Prevent directory traversal
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  // Helper to send file
  function sendFile(targetPath) {
    fs.stat(targetPath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head><title>404 Not Found</title><style>body{font-family:sans-serif;text-align:center;padding:50px;background:#121212;color:#fff;} a{color:#4da6ff;text-decoration:none;font-weight:bold;}</style></head>
            <body>
              <h1>404 - Page Not Found</h1>
              <p>The requested file <code>${pathname}</code> does not exist.</p>
              <p><a href="/">← Go back to SVNIT Helpdesk Home</a></p>
            </body>
          </html>
        `);
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache'
      });

      const readStream = fs.createReadStream(targetPath);
      readStream.pipe(res);
    });
  }

  // Check if file exists directly
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(filePath);
    } else if (!err && stats.isDirectory()) {
      // Check index.html inside directory
      const dirIndex = path.join(filePath, 'index.html');
      fs.stat(dirIndex, (indexErr, indexStats) => {
        if (!indexErr && indexStats.isFile()) {
          sendFile(dirIndex);
        } else {
          sendFile(filePath); // will 404
        }
      });
    } else {
      // Try appending .html or .htm extension
      const htmlPath = filePath + '.html';
      const htmPath = filePath + '.htm';

      fs.stat(htmlPath, (htmlErr, htmlStats) => {
        if (!htmlErr && htmlStats.isFile()) {
          sendFile(htmlPath);
        } else {
          fs.stat(htmPath, (htmErr, htmStats) => {
            if (!htmErr && htmStats.isFile()) {
              sendFile(htmPath);
            } else {
              sendFile(filePath); // will trigger 404
            }
          });
        }
      });
    }
  });
});

let currentPort = Number(PORT);

function startServer(port) {
  server.listen(port, HOST);
}

// Registered once, outside startServer(): passing a callback to server.listen()
// adds a 'listening' listener that is NOT removed when the bind fails, so a
// retry would accumulate listeners and print one banner per attempt - including
// the port that never actually bound. Reading server.address() instead always
// reports the port we really ended up on.
server.on('listening', () => {
  const actualPort = server.address().port;
  console.log(`\n==================================================`);
  console.log(`   SVNIT Student Helpdesk Server is Running!`);
  console.log(`   -> URL: http://localhost:${actualPort}/`);
  console.log(`==================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Port ${currentPort} in use, trying port ${currentPort + 1}...]`);
    currentPort += 1;
    startServer(currentPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);

