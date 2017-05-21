const nextRoutes = require("next-routes");
const routes = (module.exports = nextRoutes());

routes.add("comic", "/comic/:comicId-:slug");
routes.add(
  "bubble",
  "/comic/:comicId-:slug/:pageId-:panelId-:bubbleId",
  "comic"
);
