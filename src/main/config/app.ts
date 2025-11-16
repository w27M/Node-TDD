import express = require('express');
import setUpMiddlewares from './middlewares';
import setUpRoutes from './routes';

const app = express();
setUpMiddlewares(app);
setUpRoutes(app);
export default app;
