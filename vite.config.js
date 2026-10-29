import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

const single = !!process.env.SINGLE;

export default defineConfig({
  plugins: [react(), ...(single ? [viteSingleFile()] : [])],
  build: { assetsInlineLimit: single ? 100_000_000 : 4096, chunkSizeWarningLimit: 2000 }
});
