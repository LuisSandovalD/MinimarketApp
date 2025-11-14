import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  darkMode: "class",
  server: {
    host: true,
    port: 5173,
    allowedHosts: [".ngrok-free.app", "localhost", "127.0.0.1", "0.0.0.0"],
    cors: {
      origin: "*",
      credentials: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  
});
