import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';

mkdirSync('pages-dist', { recursive: true });
copyFileSync('release/appletv_agnative.js', 'pages-dist/appletv_agnative.js');

const html = `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AppleTV AgNative NG</title>
</head>
<body>
  <h1>AppleTV AgNative NG</h1>
  <p>Готовий build артефакт для підключення:</p>
  <pre>appletv_agnative.js</pre>
</body>
</html>`;

writeFileSync('pages-dist/index.html', html);
