import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),

        react(),
    ],

    server: {
        host: process.env.VITECONF_LOCAL || '0.0.0.0',  // Permite conexiones externas
        port: process.env.VITECONF_HOST || 5173,       // Define el puerto (puede ser cualquier puerto disponible)
        hmr: {
            host: process.env.VITECONF_PORT || 'blindspot.media.mit.edu',  // Reemplaza con la IP de tu servidor local
        },
    },
});