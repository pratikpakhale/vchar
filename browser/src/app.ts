import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import {
  launchBrowser,
  createBrowserContext,
  getPage,
  releasePage,
} from './playwright';

import { getText } from './utils';
import config from '../../shared/config.json';

const app = express();

app.use(morgan('dev'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

launchBrowser().then(() => {
  console.log('Browser launched');
  createBrowserContext().then(() => {
    console.log('Browser context created');
  });
});

app.post('/static', async (req: Request, res: Response) => {
  const { url } = req.body;

  try {
    const response = await fetch(url);
    const html = await response.text();
    res.json({ html });
  } catch (e: any) {
    console.log(e);
    res.json({ html: '' });
  }
});

app.post('/', async (req: Request, res: Response) => {
  const { url, timeout = 10, html, text } = req.body;

  console.log(url);

  try {
    const page = await getPage(timeout);

    if (!page?.page) {
      res.status(500).send('No page available');
      return;
    }

    await page.page.goto(url);
    const HTML = await page.page.content();
    releasePage(page);
    const TEXT = getText(HTML);
    let response = {};

    if (html === 'true') {
      response = { ...response, HTML };
    }
    if (text === 'true') {
      response = { ...response, TEXT };
    }

    res.json(response);
  } catch (e: any) {
    console.log(e.message);
    res.status(500).json({
      message: e.message,
    });
  }
});

app.listen(config.browser.port, () => {
  console.log(`Server running on port ${config.browser.port}`);
});

process.on('uncaughtException', (err) => {
  console.log(err.message);
  // process.exit(1);
});
