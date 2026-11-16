import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("dist");
let html = await readFile(resolve(output, "index.html"), "utf8");
const jsTag = html.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
const cssTag = html.match(/<link rel="stylesheet"[^>]*href="(\.\/assets\/[^"]+)"[^>]*>/);
if (!jsTag || !cssTag) throw new Error("Expected the compiled portfolio script and stylesheet.");
const js = await readFile(resolve(output, jsTag[1]), "utf8");
const css = await readFile(resolve(output, cssTag[1]), "utf8");
html = html.replace(/<script>if\(location\.protocol[\s\S]*?<\/script>/, "")
  .replace(jsTag[0], "").replace(cssTag[0], () => "<style>"+css+"</style>")
  .replace("</body>", () => '<script type="module">'+js.replace(/<\/script/gi, "<\\/script")+"</script></body>");
await writeFile("Portfolio.html", html);
await writeFile(resolve(output, "index.html"), html);
