import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, body } = req;
  const start = Date.now();

  // Safely copy the body to mask sensitive fields like password for security
  const safeBody = { ...body };
  if (safeBody.password) safeBody.password = "******";
  if (safeBody.passwordConfirmation) safeBody.passwordConfirmation = "******";

  console.log(`\x1b[36m[${timestamp}]\x1b[0m \x1b[33m${method}\x1b[0m ${originalUrl}`);
  if (Object.keys(safeBody).length > 0) {
    console.log(`\x1b[90m  Request Body: ${JSON.stringify(safeBody)}\x1b[0m`);
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    console.log(`  \x1b[90mResponse status:\x1b[0m ${statusColor}${res.statusCode}\x1b[0m \x1b[90m(${duration}ms)\x1b[0m`);
  });

  next();
};
