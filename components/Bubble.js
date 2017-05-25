// @flow

import type { Element } from "React";
import SpeechBubble from "./SpeechBubble";
import OutlinedText from "./OutlinedText";
import type { Arrows } from "./SpeechBubble";

type Props = {
  type: "SPEECH_BUBBLE" | "OUTLINED_TEXT",
  arrows?: Arrows,
  children?: Element<any>
};

const Bubble = (props: Props) => (
  <div className="translate-bubble">
    {props.type === "SPEECH_BUBBLE"
      ? <SpeechBubble arrows={props.arrows}>{props.children}</SpeechBubble>
      : null}

    {props.type === "OUTLINED_TEXT"
      ? <OutlinedText>{props.children}</OutlinedText>
      : null}

    <style global jsx>{`
      .translate-bubble {
        font-size: 24px;
        line-height: 34px;
      }
    `}</style>
  </div>
);

export default Bubble;
