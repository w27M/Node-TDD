import {Express} from "express";
import {bodyParser, cors, contentType, logger} from "../middlewares";

export default (app: Express): void => {
    app.use(logger);
    app.use(bodyParser);
    app.use(cors);
    app.use(contentType);
}
