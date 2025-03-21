import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),

        react(),
    ],

    server: {
        host: '0.0.0.0',  // Permite conexiones externas
        port: 5173,      // Define el puerto (puede ser cualquier puerto disponible)
        hmr: {
            host: '10.214.89.90', // IP de tu adaptador Wi-Fi
            // host: '192.168.1.124', // IP de tu adaptador Wi-Fi

        },
    },
});