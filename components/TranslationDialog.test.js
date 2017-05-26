// @flow

import React from "react";
import ReactDOM from "react-dom";

import TranslationDialog from "./TranslationDialog";

describe("TranslationDialog component", () => {
  it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <TranslationDialog
        status={{ active: false, success: false, error: false }}
        originalText="Original text"
        translatedText="Translated text"
        onClose={() => {}}
      />,
      div
    );
  });
});
