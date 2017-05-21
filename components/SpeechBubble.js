// @flow

import type { Element } from "React";

type Props = {
  children?: Element<any>
};

const SpeechBubble = (props: Props) => (
  <div className="speech-bubble">
    <div className="speech-bubble__content">{props.children}</div>

    <style global jsx>{`
      .speech-bubble {
        padding-bottom: 16px;
      }

      .speech-bubble__content {
        background-color: white;
        border-radius: 30px;
        border: 2px solid black;
        padding: 16px;
        position: relative;
      }

      .speech-bubble__content:before,
      .speech-bubble__content:after {
        content: "";
        display: block;
        position: absolute;
        top: 100%;
        width: 0;
      }

      .speech-bubble__content:before {
        border-right: 18px solid transparent;
        border-top: 20px solid black;
        margin-left: 24px;
      }

      .speech-bubble__content:after {
        border-right: 18px solid transparent;
        border-top: 20px solid white;
        margin-left: 26px;
        margin-top: -5px;
      }
    `}</style>
  </div>
);

export default SpeechBubble;
