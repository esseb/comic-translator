// @flow

import type { Element } from "React";

type Props = {
  children?: Element<any>
};

const SpeechBubble = (props: Props) => (
  <div className="speech-bubble">
    {props.children}

    <style jsx global>{`
      .speech-bubble {
        background-color: white;
        border-radius: 17px;
        border: 2px solid black;
        padding: 10px;
        position: relative;
      }

      .speech-bubble:before,
      .speech-bubble:after {
        content: "";
        display: block;
        position: absolute;
        top: 100%;
        width: 0;
      }

      .speech-bubble:before {
        border-right: 14px solid transparent;
        border-top: 16px solid black;
        margin-left: 10px;
      }

      .speech-bubble:after {
        border-right: 14px solid transparent;
        border-top: 16px solid white;
        margin-left: 12px;
        margin-top: -5px;
      }
    `}</style>
  </div>
);

export default SpeechBubble;
