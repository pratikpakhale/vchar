import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import config from '../../shared/config.json';

import { manager, invoke_tools } from './tools/manager';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/search', async (req, res) => {
  try {
    let prompt = req.query?.prompt;
    let id = req.query?.id;

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    res.json({
      id,
    });

    // @ts-ignore
    manager(prompt, id).then((tools) => {
      // @ts-ignore
      invoke_tools(tools, prompt, id);
    });
  } catch (error) {
    console.log('Some error in process ', error);
    res.json({
      response: 'Something went wrong. Please try again.',
      sources: [],
    });
  }
});

const ioConfig = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on('connection', (socket: Socket) => {
    const sessionId = socket.handshake.query.sessionId || 'default';
    console.log(`Socket connected with session ID: ${sessionId}`);
    socket.join(sessionId);
    socket.on('disconnect', () => {
      console.log(`User disconnected with session ID: ${sessionId}`);
    });
  });
};

const server = http.createServer(app);

export const io = new Server(server, {
  path: '',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Authorization'],
  },
  cleanupEmptyChildNamespaces: true,
});

ioConfig(io);

server.listen(config.core.port, () => {
  console.log('Server is running on port ' + config.core.port);
});

process.on('uncaughtException', (err) => {
  console.log(err.message);
  // process.exit(1);
});
