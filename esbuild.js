const { build } = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

build({
  entryPoints: ["src/index.js"],
  outdir: "dist",
  bundle: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  format: "esm",
  target: ["es2015"],
  loader: {
    ".js": "jsx",
  },
  plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1));
