import express from 'express';
const app = express();
import './database/mongoose';

import usersRouter from './routes/users';

app.use(express.json());

app.use('/api/users/', usersRouter);

export default app;
