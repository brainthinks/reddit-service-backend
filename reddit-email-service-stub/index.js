const http = require('http');
const util = require('util');

const express = require('express');
const { createTerminus } = require('@godaddy/terminus');

const HOSTNAME = 'reddit-email-service-stub';
const PORT = 80;

const app = express();
const server = http.createServer(app);

createTerminus(server, {
  signals: [
    'SIGTERM',
    'SIGINT',
    'SIGHUP',
  ],
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/', (req, res) => {
  console.log(util.inspect(req.body, {
    showHidden: false,
    depth: null,
  }));

  res.status(200).send({ success: true });
});

server.listen(PORT, () => {
  console.log(`${HOSTNAME} app listening at http://${HOSTNAME}:${PORT}`);
});
