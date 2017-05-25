// @flow

import { configure } from "@storybook/react";

console.log("config.js");

function loadStories() {
  console.log("config.js > loadStories()");
  require("../stories/index.js");
}

configure(loadStories, module);
