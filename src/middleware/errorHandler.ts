import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { Logger } from '../logger';

export default function (logger: Logger) {
  return function errorHandler (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    logger.error([
      `Responding to request from ${req.ip} to ${req.method} ${req.path}`,
      error,
    ]);

    res.status(500).send({
      error: error.stack,
    });

    // if (req.xhr) {
    //   res.status(500).send({
    //     error: 'Fatal server error.',
    //   });
    // }
    // else {
    //   next(error);
    // }
  };
}
