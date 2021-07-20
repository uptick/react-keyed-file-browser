const { build } = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')

const configuration = {
  outdir: 'dist',
  entryPoints: ['src/index.js'],
  bundle: true,
  sourcemap: true,
  minify: true,
  target: 'es2015',
  loader: {
    '.js': 'jsx',
  },
  plugins: [nodeExternalsPlugin()],
}

async function esbuild() {
  // build esm version.
  await build({
    ...configuration,
    format: 'esm',
    splitting: true,
    outExtension: { '.js': '.esm.js' },
    outdir: 'dist',
  }).catch(() => process.exit(1))

  // build cjs version.
  await build({
    ...configuration,
    format: 'cjs',
  }).catch(() => process.exit(1))
}

esbuild()
