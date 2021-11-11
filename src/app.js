import express from 'express';
import cors from 'cors';
const app = express();
import './database/mongoose';

import usersRouter from './routes/users';
import languagesRouter from './routes/languages';
import countriesRouter from './routes/countries';
import meetingsRouter from './routes/meetings';

app.use(express.json());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/meetings', meetingsRouter);

export default app;
