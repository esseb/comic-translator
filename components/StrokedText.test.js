// @flow

import React from "react";
import ReactDOM from "react-dom";
import { render } from "enzyme";

import StrokedText from "./StrokedText";

describe("StrokedText component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<StrokedText>Foo bar baz</StrokedText>, div);
  });

  it("Should render its children", () => {
    const component = render(<StrokedText>Foo bar baz</StrokedText>);

    expect(component.text()).toEqual("Foo bar baz");
  });
});
