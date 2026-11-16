import http from "node:http";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const portfolio = await readFile(new URL("../Portfolio.html", import.meta.url));
const server = http.createServer((req, res) => {
  if (req.url?.split("?")[0] !== "/") { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(portfolio);
});
server.listen(0, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + server.address().port + "/";
  console.log("Portfolio is running at " + url + "\nKeep this window open while viewing.");
  if(process.platform === "win32") spawn("rundll32", ["url.dll,FileProtocolHandler",url], {stdio:"ignore"}).on("error",()=>console.log("Open the URL above in your browser."));
});
