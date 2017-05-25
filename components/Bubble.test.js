// @flow

import React from "react";
import ReactDOM from "react-dom";

import Bubble from "./Bubble";

describe("Bubble component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Bubble type="SPEECH_BUBBLE" text="Foo bar bax" onSelect={text => {}} />,
      div
    );
  });
});
