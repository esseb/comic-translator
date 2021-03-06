// @flow

import type { Element } from "React";
import {
  BUBBLE_PADDING_OUTER,
  BUBBLE_PADDING_INNER,
  BUBBLE_BORDER_WIDTH
} from "../variables/spacing";

type Props = {
  children?: Element<any>
};

const StrokedText = (props: Props) => (
  <div className="stroked-text">
    {props.children}

    <style global jsx>{`
      /**
       * White text with a black stroke.
       *
       * 1. Not the most efficient way to do outlines,
       *    but simple and works cross browser
       *    without needing a copy of text in the DOM.
       */
      .stroked-text {
        padding: ${BUBBLE_PADDING_OUTER + BUBBLE_PADDING_INNER + BUBBLE_BORDER_WIDTH}px;
        color: white;
        font-size: 28px;
        position: relative;
        text-align: center;
        text-shadow:
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black,
          0 0 5px black;
      }
    `}</style>
  </div>
);

export default StrokedText;
