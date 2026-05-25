import { defineConfig } from 'vite';

// Vite configuration for local development
// Note: In production, the raw HTML/CSS/JS files are served directly by Apache/Nginx
// Vite is only used as a dev tool for hot-reload during development
export default defineConfig({
  // Root directory for the project
  root: '.',

  // Development server settings
  server: {
    port: 5173,        // Default Vite port
    open: true,        // Auto-open browser on dev start
    host: true,        // Listen on all addresses (for network access)
  },

  // Build settings (if you ever need to create an optimized build)
  build: {
    outDir: 'dist',    // Output directory
    emptyOutDir: true, // Clean output dir before build
  },
});
