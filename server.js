// @flow

const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");
const nconf = require("nconf");
const MsTranslator = require("mstranslator");

const dev = process.env.NODE_ENV !== "production";

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'config.json'
nconf.argv().env().file({ file: "./config.json" });

const app = next({ dev });
const handle = app.getRequestHandler();

var msTranslatorClient = new MsTranslator(
  { api_key: nconf.get("MSTRANSLATOR_API_KEY") },
  true
);

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.json());

    server.post("/api/translate", (req, res) => {
      const params = {
        text: req.body.text,
        from: req.body.from,
        to: req.body.to
      };

      msTranslatorClient.translate(params, (err, translation) => {
        if (err) throw err;

        res.send(JSON.stringify({ translation: translation }));
      });
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
