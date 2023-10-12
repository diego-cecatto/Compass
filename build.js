const esbuild = require('esbuild');
require('dotenv').config();
const clientEnv = { 'process.env.NODE_ENV': `'production'` };

esbuild
    .build({
        entryPoints: ['./src/index.tsx'],
        bundle: true,
        minify: true,
        sourcemap: true,
        define: clientEnv,
        outdir: './dist',
        publicPath: '/public',
        loader: {
            '.tsx': 'tsx',
            '.ts': 'ts',
            '.js': 'jsx',
            '.scss': 'css',
            '.png': 'dataurl',
            '.jpg': 'dataurl',
            '.svg': 'dataurl',
        },
    })
    .catch(() => process.exit(1));
