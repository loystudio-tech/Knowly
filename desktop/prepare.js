// Copies the web app (../index.html + icons) into ./app so it gets bundled into the desktop app.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
fs.rmSync(path.join(__dirname, 'app'), { recursive: true, force: true });
fs.mkdirSync(path.join(__dirname, 'app', 'icons'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(__dirname, 'app', 'index.html'));
for (const f of fs.readdirSync(path.join(root, 'icons'))) fs.copyFileSync(path.join(root, 'icons', f), path.join(__dirname, 'app', 'icons', f));
fs.copyFileSync(path.join(root, 'icons', 'icon-512.png'), path.join(__dirname, 'build', 'icon.png'));
console.log('App files ready in desktop/app');
