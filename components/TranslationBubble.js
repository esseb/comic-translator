// @flow

import type { Element } from "React";
import SpeechBubble from "./SpeechBubble";
import type { Arrows } from "./SpeechBubble";
import SelectableWords from "../components/SelectableWords";
import StrokedText from "./StrokedText";

export const SPEECH_BUBBLE = "SPEECH_BUBBLE";
export const STROKED = "STROKED";

type Props = {
  type: "SPEECH_BUBBLE" | "STROKED",
  text: string,
  arrows?: Arrows,
  onSelect: (text: string) => void
};

function renderBubble(props: Props) {
  switch (props.type) {
    case SPEECH_BUBBLE: {
      return (
        <SpeechBubble arrows={props.arrows}>
          <SelectableWords text={props.text} onSelect={props.onSelect} />
        </SpeechBubble>
      );
    }

    case STROKED: {
      return (
        <StrokedText>
          <SelectableWords text={props.text} onSelect={props.onSelect} />
        </StrokedText>
      );
    }

    default: {
      return null;
    }
  }
}

const TranslationBubble = (props: Props) => {
  return (
    <div className="translation-bubble">
      {renderBubble(props)}

      <style global jsx>{`
        .translation-bubble {
          font-size: 24px;
          line-height: 34px;
        }
      `}</style>
    </div>
  );
};

export default TranslationBubble;
