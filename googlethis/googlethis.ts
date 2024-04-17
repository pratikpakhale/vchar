import { RequestHandler } from 'express';
import googlethis from 'googlethis';
import { googlethisOptions } from './types/googlethis';

export const googleSearch: RequestHandler = async (req, res, next) => {
  try {
    let search = req.query.q as string;
    const options: googlethisOptions = req.body.options;
    options.safe = options?.safe || true;
    options.parse_ads = options?.parse_ads || false;
    for (const param in options?.params) {
      //@ts-ignore
      search += ` ${param}:${options.params[param]}`;
    }
    const result = await googlethis.search(search, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const googleImageSearch: RequestHandler = async (req, res, next) => {
  try {
    const search = req.query.q as string;
    const result = await googlethis.image(search);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
