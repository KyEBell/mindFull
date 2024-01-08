import { Request } from 'express';
import { User } from './models/userModel';

interface ExtendedRequest<T = any> extends Request<T> {
  user?: User;
}

export { ExtendedRequest };
