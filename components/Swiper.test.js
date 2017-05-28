// @flow

import React from "react";
import ReactDOM from "react-dom";
import { render } from "enzyme";

import Swiper from "./Swiper";

describe("Swiper component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Swiper
        previousSlide={<div />}
        currentSlide={<div />}
        nextSlide={<div />}
        onSwipeSuccess={(direction: "previous" | "next") => {}}
      />,
      div
    );
  });
});
