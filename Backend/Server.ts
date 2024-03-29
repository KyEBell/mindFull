import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import journalRoutes from './routes/journalRoutes';
import loginRoute from './routes/loginRoute';
import logoutRoute from './routes/logoutRoute';
import signUpRoute from './routes/signUpRoute';
import tokenRoute from './routes/tokenRoute';
import formMailer from './routes/formMailer';
import { checkAuthentication } from './middleware/checkAuthentication';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

dotenv.config({ path: path.resolve(__dirname, './../.env') });

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

//initial app.use calls------------------------------------------------->
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes to use------------------------------------------------->

app.use('/api/signup', signUpRoute);
app.use('/api/check-auth', checkAuthentication);
app.use('/api/users', userRoutes);
app.use('/api/journal-entries', journalRoutes);
app.use('/api/login', loginRoute);
app.use('/api/token', tokenRoute);
app.use('/api/logout', logoutRoute);
app.use('/api/contact-form-submit', formMailer);

//Get call from backend------------------------------------------------->
app.get('/', (req: Request, res: Response) => {
  res.send('Hello From the backend!');
});

//<---------------------------ERROR HANDLING------------------------->
//Catch-all route error handler, sends status of 404 and "page not found"
app.use((req, res) => res.status(404).send('Page Not Found'));
//GLOBAL ERROR HANDLER
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

//<---------------------------APP.LISTEN------------------------->
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
