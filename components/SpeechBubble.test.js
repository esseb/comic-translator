import React from "react";
import ReactDOM from "react-dom";
import { render } from "enzyme";

import SpeechBubble from "./SpeechBubble";

describe("SpeechBubble component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SpeechBubble>Foo bar baz</SpeechBubble>, div);
  });

  it("Should render its children", () => {
    const component = render(<SpeechBubble>Foo bar baz</SpeechBubble>);

    expect(component.text()).toEqual("Foo bar baz");
  });
});
