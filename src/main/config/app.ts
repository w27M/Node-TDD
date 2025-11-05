import express = require('express');
import setUpMiddlewares from './middlewares';

const app = express();
setUpMiddlewares(app);
export default app;
