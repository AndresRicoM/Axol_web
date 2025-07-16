import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.jsx'],
                refresh: true,
            }),
            react(),
        ],
        server: {
            host: env.VITE_SERVER_HOST || '0.0.0.0',
            port: parseInt(env.VITE_SERVER_PORT) || 5173,
            hmr: {
                host: env.VITE_HMR_HOST || 'localhost',
                port: parseInt(env.VITE_HMR_PORT) || 5173,
            },
        },
    };
});