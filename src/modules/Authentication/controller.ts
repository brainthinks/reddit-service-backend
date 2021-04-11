import {
  Request,
  Response,
  NextFunction,
} from 'express';

export async function login (req: Request, res: Response, next: NextFunction) {
  next();
}

export async function logout (req: Request, res: Response, next: NextFunction) {
  next();
}
