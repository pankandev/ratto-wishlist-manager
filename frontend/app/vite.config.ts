import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        hmr: true,
        host: '0.0.0.0',
        port: 3001,
        open: false,
        watch: {
            usePolling: true,
            disableGlobbing: false,
        },
        cors: true
    },
    base: '/static/',
    build: {
        outDir: '../../static',
        assetsDir: '',
        manifest: 'manifest.json',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/main.tsx'),
            },
            output: {
                chunkFileNames: undefined
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src')
        }
    }
})
