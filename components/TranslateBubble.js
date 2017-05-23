// @flow

import SpeechBubble from "./SpeechBubble";
import SelectableWords from "./SelectableWords";

type Props = {
  text: string,
  onSelect: (text: string) => void
};

const TranslateBubble = (props: Props) => (
  <div className="translate-bubble">
    <SpeechBubble>
      <SelectableWords text={props.text} onSelect={props.onSelect} />
    </SpeechBubble>
  </div>
);

export default TranslateBubble;
