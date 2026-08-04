const fs = require('fs');
const http = require('http');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3333;
const ROOT_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // API Endpoint para publicar a GitHub ejecutando git push de Windows
  if (req.method === 'POST' && urlPath === '/api/publish-github') {
    console.log('🚀 Iniciando publicación a GitHub desde servidor local...');

    exec('git add .', { cwd: ROOT_DIR }, (addErr) => {
      const commitMsg = `admin: update configuration (${new Date().toLocaleString()})`;
      exec(`git commit -m "${commitMsg}"`, { cwd: ROOT_DIR }, () => {
        
        // Ejecutar git push para que salte el Credential Manager de Windows
        exec('git push origin main', { cwd: ROOT_DIR }, (pushErr, stdout, stderr) => {
          res.setHeader('Content-Type', 'application/json');
          if (pushErr) {
            console.error('❌ Error o cancelación en git push:', stderr || pushErr.message);
            res.statusCode = 500;
            return res.end(JSON.stringify({
              success: false,
              message: 'Error al subir los cambios a GitHub. Verificá la ventana de credenciales de Windows.',
              details: stderr || pushErr.message
            }));
          }

          console.log('✅ Publicación a GitHub completada exitosamente.');
          res.statusCode = 200;
          return res.end(JSON.stringify({
            success: true,
            message: '¡Cambios subidos y publicados exitosamente en GitHub Pages!',
            details: stdout
          }));
        });

      });
    });
    return;
  }

  // Servir archivos estáticos
  let filePath = path.join(ROOT_DIR, urlPath === '/' ? 'index.html' : urlPath);
  if (urlPath === '/admin') filePath = path.join(ROOT_DIR, 'admin.html');

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`
=============================================
🚀 Servidor Local de CS CFG Builder listo
=============================================
Accedé en: http://localhost:${PORT}
Admin en:  http://localhost:${PORT}/admin.html
=============================================
  `);
});
