// Environment safety checks for CloudLinux/o2switch
if (!process.env.NODE_OPTIONS?.includes('--no-wasm-memory-reservation')) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --no-wasm-memory-reservation`.trim()
}
process.env.ASTRO_NODE_AUTOSTART = 'disabled';
process.env.ASTRO_KEY = 'MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=';
process.env.SITE = 'https://alexis-vuadelle.com';
process.env.NODE_ENV = 'production';

import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Custom entry point for o2switch (Phusion Passenger).
 * For Astro apps set to output: 'server' and adapter: node({ mode: 'middleware' }),
 * the core server logic exports a handler function.
 */
import('./dist/server/entry.mjs').then(({ handler }) => {
    const app = express();
    
    // 1. Serve static files from the client directory (CSS, JS, Images) using absolute paths
    const clientPath = path.join(__dirname, 'dist', 'client');
    console.log("Serving static files from:", clientPath);
    app.use(express.static(clientPath));
    
    // 2. Use the Astro SSR handler for everything else
    app.use(handler);
    
    // Phusion Passenger hijacks the listen() call.
    app.listen();
    
    console.log("Frontend SSR Server with Static Assets initialized for Passenger.");
}).catch(err => {
    console.error('Frontend failed to start. Ensure you ran `npm run build` before starting the server.', err);
});
