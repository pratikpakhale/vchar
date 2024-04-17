import config from '../../../shared/config.json';

const myHeaders: Headers = new Headers();
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

const urlencoded: URLSearchParams = new URLSearchParams();
urlencoded.append('url', 'https://www.google.com');

const requestOptions: RequestInit = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow',
};

async function makeConcurrentRequests(x: number) {
  const promises: Promise<any>[] = [];
  for (let i = 0; i < x; i++) {
    promises.push(
      fetch(
        `http://${config.browser.host}:${config.browser.port}/`,
        requestOptions
      )
        .then((response: Response) => response.text())
        .then(() => console.log('received response', i))
        .catch((error: any) => console.log('error', error))
    );
  }
  const t = Date.now();
  await Promise.all(promises);
  console.log('Time taken:', Date.now() - t);
}

// Extracting the value of x from command line arguments
const args = process.argv.slice(2);
const concurrentIndex = args.indexOf('--concurrent');
const x = concurrentIndex !== -1 ? parseInt(args[concurrentIndex + 1]) : 1;

// Example: Make x concurrent requests
makeConcurrentRequests(x);
