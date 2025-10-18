
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist", // output folder for Netlify
    chunkSizeWarningLimit: 1000, // increase size warning limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate vendor code (improves loading speed)
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
}));
