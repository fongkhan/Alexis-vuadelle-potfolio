// Environment safety checks for CloudLinux/o2switch
if (!process.env.NODE_OPTIONS?.includes('--no-wasm-memory-reservation')) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --no-wasm-memory-reservation`.trim()
}
process.env.ASTRO_NODE_AUTOSTART = 'disabled';
process.env.SITE = 'https://alexis-vuadelle.com';
process.env.NODE_ENV = 'production';

import http from 'node:http';

/**
 * Custom entry point for o2switch (Phusion Passenger).
 * For Astro apps set to output: 'server' and adapter: node({ mode: 'middleware' }),
 * the core server logic exports a handler function.
 * We create a basic HTTP server with this handler, which Passenger automatically intercepts.
 */
import('./dist/server/entry.mjs').then(({ handler }) => {
    const server = http.createServer((req, res) => {
        handler(req, res, () => {
            res.statusCode = 404;
            res.end('Not found');
        });
    });
    
    // Phusion Passenger hijacks the listen() call, so the port doesn't matter here.
    server.listen();
    console.log("Frontend SSR Server initialized for Passenger.");
}).catch(err => {
    console.error('Frontend failed to start. Ensure you ran `npm run build` before starting the server.', err);
});
