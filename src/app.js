import express from 'express';
import cors from 'cors';
const app = express();
import './database/mongoose';

import usersRouter from './routes/users';

app.use(express.json());
app.use(cors());

app.use('/api/users/', usersRouter);

export default app;
