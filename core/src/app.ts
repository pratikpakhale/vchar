import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import config from '../../shared/config.json';
import { manager, invoke_tools } from './tools/manager';
import { getURL } from './utils';
import { JSONStore } from './store';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/search', async (req, res) => {
  try {
    let prompt = req.query?.prompt;
    let id = req.query?.id;
    let deeper = req.query?.deeper || false;

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    res.json({
      id,
    });

    // @ts-ignore
    manager(prompt, id, deeper).then((tools) => {
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

app.get('/competitor', (req, res) => {
  try {
    const company_name = req.query.company_name;
    const before = req.query?.before;
    const after = req.query?.after;

    fetch(getURL('googlethis') + '/search?q=' + company_name, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        options: {
          safe: true,
          params: {
            inurl: 'vs',
            intitle: company_name,
            intext: 'competitor',
            before,
            after,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // @ts-ignore
        const results = data?.results;
        res.status(200).json(results);
      });
  } catch (error) {
    console.log(error);
  }
});

app.get('/library', (_, res) => {
  try {
    const store = new JSONStore();
    const history = store.getAll();

    let filteredHistory = Object.keys(history).map((key) => {
      return {
        id: key,
        prompt: history[key][0]?.prompt,
        answer: history[key][0]?.answer,
      };
    });

    res.status(200).json(filteredHistory);
  } catch (error) {
    console.log(error);
  }
});

const pastEvents: {
  [key: string]: { event: string; data: any }[];
} = {};

const pushPastEvent = (sessionId: string, event: string, data: any) => {
  if (!pastEvents[sessionId]) {
    pastEvents[sessionId] = [];
  }
  pastEvents[sessionId].push({ event, data });
};

const ioConfig = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on('connection', (socket: Socket) => {
    const sessionId = socket.handshake.query.sessionId || 'default';

    const sendPastEvents = () => {
      // @ts-ignore
      if (!sessionId || !pastEvents[sessionId]) return;

      // @ts-ignore
      pastEvents[sessionId].forEach((event) => {
        io.to(sessionId).emit(event.event, event.data);
      });
      // @ts-ignore
      pastEvents[sessionId] = [];
    };

    console.log(`Socket connected with session ID: ${sessionId}`);
    socket.join(sessionId);
    sendPastEvents();
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
export const emitEvent = (sessionId: string, event: string, data: any) => {
  io.to(sessionId).emit(event, data);
  pushPastEvent(sessionId, event, data);
};

server.listen(config.core.port, () => {
  console.log('Server is running on port ' + config.core.port);
});

process.on('uncaughtException', (err) => {
  console.log(err.message);
  // process.exit(1);
});
