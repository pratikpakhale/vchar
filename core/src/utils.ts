import config from '../../shared/config.json';

type Service = 'browser' | 'googlethis' | 'ai' | 'tradingview';

export function getURL(service: Service) {
  let host: string;
  let port: string;

  switch (service) {
    case 'browser':
      host = config.browser.host;
      port = config.browser.port;
      break;
    case 'googlethis':
      host = config.googlethis.host;
      port = config.googlethis.port;
      break;
    case 'ai':
      host = config.ai.host;
      port = config.ai.port;
      break;
    case 'tradingview':
      host = config.tradingview.host;
      port = config.tradingview.port;
      break;
  }

  // @ts-ignore
  return `http://${config.hosts[host]}:${port}`;
}

export { config };
