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
            host: "192.168.1.59",  // Reemplaza con la IP de tu servidor local
        },
    },
});