import express from 'express';
import cors from 'cors';
const app = express();
import './database/mongoose';

import usersRouter from './routes/users';
import languagesRouter from './routes/languages';
import countriesRouter from './routes/countries';
import meetingsRouter from './routes/meetings';
import userMediasRouter from './routes/userMedias';
import integratedUserMediasRouter from './routes/integratedUserMedias';
import conversationsRouter from './routes/conversations';

app.use(express.json());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/userMedias', userMediasRouter);
app.use('/api/conversations', conversationsRouter);
app.use('api/integratedusermedias', integratedUserMediasRouter);

export default app;
