// @flow

import SpeechBubble from "./SpeechBubble";
import SelectableWords from "./SelectableWords";
import type { Arrows } from "./SpeechBubble";

type Props = {
  text: string,
  arrows?: Arrows,
  onSelect: (text: string) => void
};

const TranslateBubble = (props: Props) => (
  <div className="translate-bubble">
    <SpeechBubble arrows={props.arrows}>
      <SelectableWords text={props.text} onSelect={props.onSelect} />
    </SpeechBubble>
  </div>
);

export default TranslateBubble;
