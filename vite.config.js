import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // strictPort: fail loudly instead of silently jumping to 5174.
    // localStorage is origin-scoped (host:port), so a port jump effectively
    // hides all stored tasks. Better to stop the boot and tell the user.
    strictPort: true,
    open: true,
  },
});
