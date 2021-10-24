import express from 'express';
import cors from 'cors';
const app = express();
import './database/mongoose';

import usersRouter from './routes/users';
import languagesRouter from './routes/languages';

app.use(express.json());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/languages', languagesRouter);
export default app;
