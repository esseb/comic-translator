// @flow

import React from "react";
import ReactDOM from "react-dom";
import { render } from "enzyme";

import Loader from "./Loader";

describe("Loader component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Loader />, div);
  });
});
