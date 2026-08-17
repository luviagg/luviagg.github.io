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

  // API Endpoint para guardar secciones, redes y publicidad en index.html
  if (req.method === 'POST' && urlPath === '/api/save-networks') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const indexPath = path.join(ROOT_DIR, 'index.html');
        let htmlContent = fs.readFileSync(indexPath, 'utf8');

        // Construir bloques HTML dinámicos para cada Sección
        const sectionsHtml = (data.sections || []).map(sec => {
          const linksHtml = (sec.links || []).map(link => {
            const isSelfToggle = link.url === '#';
            const actionAttr = isSelfToggle 
              ? 'href="#" onclick="event.preventDefault(); APP.toggleSidebarView(\'default\')"' 
              : `href="${link.url}" target="_blank" rel="noopener noreferrer"`;
            return `              <li><a ${actionAttr}><span>${link.icon}</span> ${link.label}</a></li>`;
          }).join('\n');

          return `            <div class="sidebar-section-label ${sec.styleColor || 'neon-pink-text'}">${sec.title}</div>
            <ul class="neon-list" style="margin-bottom: 20px;">
${linksHtml}
            </ul>`;
        }).join('\n\n');

        const newDynamicBlock = `<div id="social-networks-dynamic-section">
${sectionsHtml}
            <ul class="neon-list" style="margin-bottom: 20px;">
              <li><a href="#" id="btn-show-disclaimer" onclick="event.preventDefault();"><span>⚖️</span> Términos</a></li>
            </ul>
          </div>`;

        // Reemplazar bloque en index.html
        htmlContent = htmlContent.replace(/<div id="social-networks-dynamic-section">[\s\S]*?<\/div>/, newDynamicBlock);

        // Reemplazar Client AdSense
        if (data.adsenseClient) {
          htmlContent = htmlContent.replace(/client=ca-pub-\d+/, `client=${data.adsenseClient}`);
        }

        // Reemplazar Título AdBlock
        if (data.adblockTitle) {
          htmlContent = htmlContent.replace(/(<h2[^>]*>)([\s\S]*?)(<\/h2>)/, `$1\n        ${data.adblockTitle}\n      $3`);
        }

        fs.writeFileSync(indexPath, htmlContent, 'utf8');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('Error guardando secciones en index.html:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API Endpoint para publicar a GitHub ejecutando git push de Windows
  if (req.method === 'POST' && urlPath === '/api/publish-github') {
    console.log('🚀 Iniciando publicación a GitHub desde servidor local...');

    exec('git add .', { cwd: ROOT_DIR }, (addErr) => {
      const commitMsg = `admin: update sections and ads (${new Date().toLocaleString()})`;
      exec(`git commit -m "${commitMsg}"`, { cwd: ROOT_DIR }, () => {
        
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
