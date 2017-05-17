import React from "react";
import ReactDOM from "react-dom";

import SelectableWords from "./SelectableWords";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <SelectableWords text="Foo bar bax" onSelect={text => {}} />,
    div
  );
});
