import {Controller, HttpRequest} from "../../presentation/protocols";
import {Request, Response, NextFunction} from "express";

export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httpRequest: HttpRequest = {
            body: req.body,
        }
        const httpResponse = await controller.handle(httpRequest);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
}
