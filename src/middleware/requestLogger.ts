import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { Logger } from '../logger';

export default function (logger: Logger) {
  return function requestLogger (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    logger.info(`Request from ${req.ip} to ${req.method} ${req.path}`);
    next();
  };
}
