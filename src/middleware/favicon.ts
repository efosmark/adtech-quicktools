import { Request, Response, NextFunction } from 'express';


/**
 * Dynamically generates a svg file that can act as a favicon.
 * Completely unnecessary but I like to be able to have distinct favicons in the tabs per-site.
 */
export default (faviconLetters: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method === 'GET' && req.path === '/favicon.ico') {
            res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            res.end(`
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <rect width="100%" height="100%" fill="#e0e0e0" rx="15" ry="15" />
                <text x="50%" y="50%" font-family="monospace" font-weight="bold" font-size="90" textLength="100" lengthAdjust="spacingAndGlyphs"
                        fill="black" text-anchor="middle" alignment-baseline="bottom" dominant-baseline="central">
                ${faviconLetters}
                </text>
                </svg>`);
        } else {
            next();
        };
    };
};
