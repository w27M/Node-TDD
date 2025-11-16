import {Express, Router} from "express";
import fastGlob from "fast-glob";

export default (app: Express): void => {
    const router = Router();
    app.use("/api", router);
    fastGlob.sync(`${__dirname}/../routes/**routes.??`).map(async file => (await import(file)).default(router))
}
