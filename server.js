// @flow

const express = require("express");
const bodyParser = require("body-parser");
const basicAuthMiddleware = require("basicauth-middleware");
const next = require("next");
const nconf = require("nconf");
const MsTranslator = require("mstranslator");
const routes = require("./routes");

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'config.json'
nconf.argv().env().file({ file: "./config.json" });

const dev = nconf.get("NODE_ENV") !== "production";

var msTranslatorClient = new MsTranslator(
  { api_key: nconf.get("MSTRANSLATOR_API_KEY") },
  true
);

const app = next({ dev });
const handler = routes.getRequestHandler(app);

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.json());

    // Set up basic auth if specified.
    if (nconf.get("BASIC_AUTH_USERNAME") && nconf.get("BASIC_AUTH_PASSWORD")) {
      server.use(
        basicAuthMiddleware(
          nconf.get("BASIC_AUTH_USERNAME"),
          nconf.get("BASIC_AUTH_PASSWORD")
        )
      );
    }

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
      return handler(req, res);
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
