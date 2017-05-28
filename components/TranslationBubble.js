// @flow

import type { Element } from "React";
import SpeechBubble from "./SpeechBubble";
import SpeechBox from "./SpeechBox";
import type { Arrows } from "./SpeechBubble";
import SelectableWords from "../components/SelectableWords";
import StrokedText from "./StrokedText";

export const SPEECH_BUBBLE = "SPEECH_BUBBLE";
export const SPEECH_BOX = "SPEECH_BOX";
export const STROKED_TEXT = "STROKED_TEXT";

type Props = {
  type: "SPEECH_BUBBLE" | "SPEECH_BOX" | "STROKED_TEXT",
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

    case SPEECH_BOX: {
      return (
        <SpeechBox arrows={props.arrows}>
          <SelectableWords text={props.text} onSelect={props.onSelect} />
        </SpeechBox>
      );
    }

    case STROKED_TEXT: {
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
