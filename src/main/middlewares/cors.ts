import {Request, Response, NextFunction} from "express";

export const cors = (req: Request, res: Response, next: NextFunction): void => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', '*');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }
    
    next();
}
