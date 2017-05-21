// @flow

import React from "react";
import ReactDOM from "react-dom";

import TranslateBubble from "./TranslateBubble";

describe("TranslateBubble component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <TranslateBubble text="Foo bar bax" onSelect={text => {}} />,
      div
    );
  });
});
