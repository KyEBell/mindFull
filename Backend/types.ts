import { Request } from 'express';
import { User } from './models/userModel';

interface ExtendedRequest extends Request {
  user?: User;
}

export { ExtendedRequest };
