import React from "react";
import ReactDOM from "react-dom";

import SpeechBubble from "./SpeechBubble";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SpeechBubble>Foo bar baz</SpeechBubble>, div);
});
