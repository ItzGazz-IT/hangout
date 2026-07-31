import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Web-specific overrides (must come before broader aliases)
      '@config/firebase': path.resolve(__dirname, 'src/lib/firebase.ts'),
      '@constants/categories': path.resolve(__dirname, 'src/lib/categories.ts'),
      '@services/notifications/push.service': path.resolve(__dirname, 'src/lib/pushStub.ts'),
      // Local web source
      '@config': path.resolve(__dirname, 'src/config'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@schemas': path.resolve(__dirname, 'src/schemas'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      // Local web components
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
});
