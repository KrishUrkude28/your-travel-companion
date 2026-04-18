/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        // Code splitting for faster initial load
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-ui": ["@radix-ui/react-dropdown-menu", "@radix-ui/react-dialog", "@radix-ui/react-accordion"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-map": ["leaflet"],
        },
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "lucide-react"],
  },
}));
