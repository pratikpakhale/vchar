```bash
npm install
npx playwright install
npm run dev # or npm run start
```

| Field       | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| Host        | localhost                                                             |
| Port        | 3000                                                                  |
| Endpoint    | /                                                                     |
| Method      | POST                                                                  |
| Parameters  |                                                                       |
| - `url`     | The URL to navigate to.                                               |
| - `timeout` | (optional) The timeout value in seconds. Default is 10 seconds.       |
| - `html`    | (optional) Set to `true` to include the HTML content in the response. |
| - `text`    | (optional) Set to `true` to include the text content in the response. |
