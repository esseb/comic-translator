// @flow

import React from "react";
import ReactDOM from "react-dom";

import TranslationBubble from "./TranslationBubble";

describe("TranslationBubble component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <TranslationBubble
        type="SPEECH_BUBBLE"
        text="Foo bar bax"
        onSelect={text => {}}
      />,
      div
    );
  });
});
