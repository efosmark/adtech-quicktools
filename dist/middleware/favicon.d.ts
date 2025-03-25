import { Request, Response, NextFunction } from 'express';
/**
 * Dynamically generates a svg file that can act as a favicon.
 * Completely unnecessary but I like to be able to have distinct favicons in the tabs per-site.
 */
declare const _default: (faviconLetters: string) => (req: Request, res: Response, next: NextFunction) => void;
export default _default;
