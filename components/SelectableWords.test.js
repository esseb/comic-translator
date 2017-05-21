// @flow

import React from "react";
import ReactDOM from "react-dom";

import SelectableWords from "./SelectableWords";

describe("SelectableWords component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <SelectableWords text="Foo bar bax" onSelect={text => {}} />,
      div
    );
  });
});
