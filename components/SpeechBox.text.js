// @flow

import React from "react";
import ReactDOM from "react-dom";
import { render } from "enzyme";

import SpeechBox from "./SpeechBox";

describe("SpeechBox component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SpeechBox>Foo bar baz</SpeechBox>, div);
  });

  it("Should render its children", () => {
    const component = render(<SpeechBox>Foo bar baz</SpeechBox>);

    expect(component.text()).toEqual("Foo bar baz");
  });
});
