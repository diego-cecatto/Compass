const { spawn } = require('child_process');
const esbuild = require('esbuild');
const { createServer, request } = require('http');
require('dotenv').config();
const handler = require('serve-handler');

const clientEnv = { 'process.env.NODE_ENV': `'dev'` };
const clients = [];

Object.keys(process.env).forEach((key) => {
  if (key.indexOf('CLIENT_') === 0) {
    clientEnv[`process.env.${key}`] = `'${process.env[key]}'`;
  }
});

const openBrowser = () => {
  setTimeout(() => {
    const op = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] };
    if (clients.length === 0) spawn(op[process.platform][0], ['http://localhost:3000']);
  }, 1000);
};

esbuild
  .build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    minify: true,
    define: clientEnv,
    outfile: 'dist/index.js',
    sourcemap: 'inline',
    watch: {
      onRebuild(error) {
        setTimeout(() => {
          clients.forEach((res) => res.write('data: update\n\n'));
        }, 1000);
        console.log(error || 'client rebuilt');
      },
    },
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

esbuild.serve({ servedir: './' }, {}).then((result) => {
  createServer((req, res) => {
    const { url, method, headers } = req;
    if (req.url === '/esbuild') {
      return clients.push(
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          Connection: 'keep-alive',
        }),
      );
    }

    const path = url.split('/').pop().indexOf('.') ? url : `/index.html`;
    const proxyReq = request({ hostname: '0.0.0.0', port: 8000, path, method, headers }, (prxRes) => {
      res.writeHead(prxRes.statusCode, prxRes.headers);
      prxRes.pipe(res, { end: true });
    });
    req.pipe(proxyReq, { end: true });
    return null;
  }).listen(5010);

  createServer((req, res) => {
    return handler(req, res, { public: 'dist' });
  }).listen(3000);

  openBrowser();
});