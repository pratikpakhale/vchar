import cheerio from 'cheerio';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export function getText(html: string) {
  const $ = cheerio.load(html);
  const document = new JSDOM(html).window.document;
  const reader = new Readability(document);
  const article = reader.parse();
  let text = $('body').prop('innerText') || '';
  return article?.textContent || text;
}
