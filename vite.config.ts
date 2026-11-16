import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  server: {host:"0.0.0.0",allowedHosts:["terminal.local"]},
  base: "./",
  plugins: [tailwind(), react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: { assetsInlineLimit: 2_000_000, cssCodeSplit: false, modulePreload: false },
});
