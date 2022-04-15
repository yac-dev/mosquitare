import express from 'express';
const app = express();
import './database/mongoose';
import path from 'path';

import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

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
import messagesRouter from './routes/messages';
import likesRouter from './routes/likes';

app.use(cors());
// HTTP headersのsecurity check
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP... Please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

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
app.use('/api/messages', messagesRouter);
app.use('/api/likes', likesRouter);
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

//   app.get('*', (request, response) => {
//     response.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
//   });
// }

export default app;
