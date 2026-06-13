import { transformAsync } from "@babel/core";
import transformReactJsx from "@babel/plugin-transform-react-jsx";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { rollup } from "rollup";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");

const resolver = {
  name: "local-resolver",
  async resolveId(source, importer) {
    if (!importer) return null;
    if (source.endsWith(".css")) return { id: resolve(dirname(importer), source), external: true };
    if (source.startsWith(".") || source.startsWith("/")) {
      const base = resolve(dirname(importer), source);
      for (const candidate of [base, `${base}.js`, `${base}.jsx`]) {
        try {
          await readFile(candidate);
          return candidate;
        } catch {
          // Try the next supported extension.
        }
      }
    }

    return null;
  },
  async transform(code, id) {
    const productionCode = code.replaceAll("process.env.NODE_ENV", '"production"');
    if (!id.endsWith(".jsx")) {
      return productionCode === code ? null : { code: productionCode, map: null };
    }
    const result = await transformAsync(code, {
      filename: id,
      plugins: [[transformReactJsx, { runtime: "automatic" }]],
      sourceMaps: false,
    });
    return {
      code: result.code.replaceAll("process.env.NODE_ENV", '"production"'),
      map: null,
    };
  },
};

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "assets"), { recursive: true });

const bundle = await rollup({
  input: resolve(root, "src/main.jsx"),
  plugins: [resolver, nodeResolve({ browser: true }), commonjs()],
  onwarn(warning, warn) {
    if (warning.code !== "MODULE_LEVEL_DIRECTIVE") warn(warning);
  },
});

await bundle.write({
  file: resolve(output, "assets/app.js"),
  format: "iife",
  banner: 'var process = { env: { NODE_ENV: "production" } };',
  sourcemap: false,
});

await copyFile(resolve(root, "src/styles.css"), resolve(output, "assets/styles.css"));

const html = (await readFile(resolve(root, "index.html"), "utf8"))
  .replace('<script type="module" src="/src/main.jsx"></script>', '<script defer src="/assets/app.js"></script>')
  .replace("</head>", '    <link rel="stylesheet" href="/assets/styles.css" />\n  </head>');

await writeFile(resolve(output, "index.html"), html);
console.log("Production build created in dist/");
