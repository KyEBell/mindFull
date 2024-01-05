import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import journalRoutes from './routes/journalRoutes';
import loginRoute from './routes/loginRoute';
import signUpRoute from './routes/signUpRoute';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './../.env') });

const app = express();
const PORT = process.env.PORT;

//initial app.use calls------------------------------------------------->
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes to use------------------------------------------------->

app.use('/api/signup', signUpRoute);
app.use('/api/users', userRoutes);
app.use('/api/journal-entries', journalRoutes);
app.use('/api/login', loginRoute);
//Get call from backend------------------------------------------------->
app.get('/', (req: Request, res: Response) => {
  res.send('Hello From the backend!');
});

//<---------------------------ERROR HANDLING------------------------->
//Catch-all route error handler, sends status of 404 and "page not found"
app.use((req, res) => res.status(404).send('Page Not Found'));
//GLOBAL ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
