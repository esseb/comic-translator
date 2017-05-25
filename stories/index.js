// @flow

import React from "react";
import { storiesOf } from "@storybook/react";

import SpeechBubble from "../components/SpeechBubble";

storiesOf("SpeechBubble", module)
  .add("with no arrows", () => <SpeechBubble>Hello Button</SpeechBubble>)
  .add('with arrow "tl"', () => (
    <SpeechBubble arrows={["tl"]}>Hello Button</SpeechBubble>
  ))
  .add('with arrow "t"', () => (
    <SpeechBubble arrows={["t"]}>Hello Button</SpeechBubble>
  ))
  .add('with arrow "tr"', () => (
    <SpeechBubble arrows={["tr"]}>Hello Button</SpeechBubble>
  ))
  .add('with arrow "l"', () => (
    <SpeechBubble arrows={["l"]}>Hello Button</SpeechBubble>
  ))
  .add('with arrow "r"', () => (
    <SpeechBubble arrows={["r"]}>Hello Button</SpeechBubble>
  ))
  .add('with arrow "bl"', () => (
    <SpeechBubble arrows={["bl"]}>Hello Button</SpeechBubble>
  ))
  .add('with arrow "b"', () => (
    <SpeechBubble arrows={["b"]}>Hello Button</SpeechBubble>
  ))
  .add('with arrow "br"', () => (
    <SpeechBubble arrows={["br"]}>Hello Button</SpeechBubble>
  ))
  .add("with all arrows", () => (
    <SpeechBubble arrows={["tl", "t", "tr", "l", "r", "bl", "b", "br"]}>
      Hello Button
    </SpeechBubble>
  ));
