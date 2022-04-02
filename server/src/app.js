import express from 'express';
import cors from 'cors';
const app = express();
import './database/mongoose';
import path from 'path';

import usersRouter from './routes/users';
import languagesRouter from './routes/languages';
import countriesRouter from './routes/countries';
import meetingsRouter from './routes/meetings';
import userMediasRouter from './routes/userMedias';
// import integratedUserMediasRouter from './routes/integratedUserMedias';
import conversationsRouter from './routes/conversations';
import userScriptsRouter from './routes/userScripts';
import commentsRouter from './routes/comments';
import transcriptsRouter from './routes/transcripts';
import docsRouter from './routes/docs';

app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
  response.send('Hello guest');
});

app.use('/api/users', usersRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/userMedias', userMediasRouter);
app.use('/api/conversations', conversationsRouter);
// app.use('/api/integratedusermedias', integratedUserMediasRouter);
app.use('/api/userscripts', userScriptsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/transcripts', transcriptsRouter);
app.use('/api/docs', docsRouter);
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

//   app.get('*', (request, response) => {
//     response.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
//   });
// }

export default app;
