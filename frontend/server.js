// Environment safety checks for CloudLinux/o2switch
process.env.ASTRO_NODE_AUTOSTART = 'disabled';
process.env.ASTRO_KEY = 'MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=';
process.env.SITE = 'https://alexis-vuadelle.com';
process.env.NODE_ENV = 'production';

import http from 'node:http';

/**
 * Custom entry point for o2switch (Phusion Passenger).
 * 
 * Uses Astro in STANDALONE mode. In standalone mode, the entry.mjs
 * exports a `handler` that serves BOTH pages AND static assets
 * (CSS, JS, images from dist/client/).
 * 
 * This is critical because on O2Switch, Apache intercepts requests 
 * to paths like /_astro/*.css BEFORE they reach Express/Node.
 * By using standalone mode's built-in handler, Astro serves assets
 * through the same request pipeline as pages, bypassing Apache.
 */
import('./dist/server/entry.mjs').then(({ handler, startServer }) => {
    // In standalone mode, Astro's handler already knows how to serve
    // static assets from dist/client/. We just need to wrap it in
    // an HTTP server for Passenger.
    const server = http.createServer((req, res) => {
        handler(req, res);
    });
    
    // Phusion Passenger hijacks the listen() call.
    server.listen();
    
    console.log("Frontend SSR Server (standalone handler) initialized for Passenger.");
}).catch(err => {
    console.error('Frontend failed to start. Ensure you ran `npm run build` before starting the server.', err);
});
