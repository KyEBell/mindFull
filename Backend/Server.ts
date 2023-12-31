import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import journalRoutes from './routes/journalRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/journal-entries', journalRoutes);
app.use('/api/auth', authRoutes);

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

//tells our port what port to listen on
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
