// @flow

import React from "react";
import ReactDOM from "react-dom";

import OutlinedText from "./OutlinedText";

describe("OutlinedText component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<OutlinedText>Foo bar baz</OutlinedText>, div);
  });
});
