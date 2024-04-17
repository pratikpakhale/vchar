# Concurrency Test

This test is designed to test the concurrency of the browser. It will open a number of tabs and then close them all at once. The test will then check if the browser is still responsive and log the response time.

```bash
npm start # start the server
```

```bash
npx tsx tests/concurrency.ts --concurrent 5 # will send 5 concurrent async requests
```
