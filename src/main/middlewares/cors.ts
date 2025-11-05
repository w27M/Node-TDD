import {Request, Response, NextFunction} from "express";

export const cors =  (req: Request, res: Response, next: NextFunction): void => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-method', '*');
    res.set('Access-Control-Allow-headers', '*');
    next();
}
