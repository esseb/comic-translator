// @flow

import type { Element } from "React";

export type Arrows = Array<"tl" | "t" | "tr" | "l" | "r" | "bl" | "b" | "br">;

type Props = {
  arrows?: Arrows,
  children?: Element<any>
};

function renderArrows(arrows?: Arrows) {
  if (!arrows) {
    return null;
  }

  // Create a unique list to make sure we have no duplicate arrows.
  arrows = Array.from(new Set(arrows));

  return arrows.map(arrow => (
    <div
      key={arrow}
      className={`speech-bubble__arrow speech-bubble__arrow--${arrow}`}
    />
  ));
}

const SpeechBubble = (props: Props) => {
  return (
    <div className="speech-bubble">
      <div className="speech-bubble__content">
        {props.children}
        {renderArrows(props.arrows)}
      </div>

      <style global jsx>{`
        .speech-bubble {
          padding: 16px 0;
        }

        .speech-bubble__content {
          background-color: white;
          border-radius: 30px;
          border: 2px solid black;
          padding: 16px;
          position: relative;
          text-align: center;
        }

        /*
          Straight arrows,
          all initially styled to point down,
          then mirrored horizontally or vertically if needed
          and absolutely positioned. 
        */
        .speech-bubble__arrow--t,
        .speech-bubble__arrow--r,
        .speech-bubble__arrow--b,
        .speech-bubble__arrow--l {
          height: 20px;
          position: absolute;
          width: 18px;
        }

        .speech-bubble__arrow--t:before,
        .speech-bubble__arrow--r:before,
        .speech-bubble__arrow--b:before,
        .speech-bubble__arrow--l:before,
        .speech-bubble__arrow--t:after,
        .speech-bubble__arrow--r:after,
        .speech-bubble__arrow--b:after,
        .speech-bubble__arrow--l:after {
          content: "";
          display: block;
          position: absolute;
          width: 0;
        }

        .speech-bubble__arrow--t:before,
        .speech-bubble__arrow--r:before,
        .speech-bubble__arrow--b:before,
        .speech-bubble__arrow--l:before {
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 20px solid black;
        }

        .speech-bubble__arrow--t:after,
        .speech-bubble__arrow--r:after,
        .speech-bubble__arrow--b:after,
        .speech-bubble__arrow--l:after {
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 20px solid white;
          margin-top: -4px;
        }

        .speech-bubble__arrow--t {
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) scaleY(-1);
        }

        .speech-bubble__arrow--r {
          left: 100%;
          top: 50%;
          transform: scaleX(-1) translateY(-50%) rotate(90deg);
        }

        .speech-bubble__arrow--b {
          left: 50%;
          top: 100%;
          transform: translateX(-50%);
        }

        .speech-bubble__arrow--l {
          right: 100%;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
        }

        /*
          Angled arrows,
          all initially styled to point to the bottom left,
          then mirrored horizontally or vertically if needed
          and absolutely positioned. 
        */
        .speech-bubble__arrow--tl,
        .speech-bubble__arrow--tr,
        .speech-bubble__arrow--bl,
        .speech-bubble__arrow--br {
          height: 20px;
          position: absolute;
          width: 18px;
        }

        .speech-bubble__arrow--tl:before,
        .speech-bubble__arrow--tr:before,
        .speech-bubble__arrow--bl:before,
        .speech-bubble__arrow--br:before,
        .speech-bubble__arrow--tl:after,
        .speech-bubble__arrow--tr:after,
        .speech-bubble__arrow--bl:after,
        .speech-bubble__arrow--br:after {
          content: "";
          display: block;
          position: absolute;
          width: 0;
        }

        .speech-bubble__arrow--tl:before,
        .speech-bubble__arrow--tr:before,
        .speech-bubble__arrow--bl:before,
        .speech-bubble__arrow--br:before {
          border-right: 18px solid transparent;
          border-top: 20px solid black;
        }

        .speech-bubble__arrow--tl:after,
        .speech-bubble__arrow--tr:after,
        .speech-bubble__arrow--bl:after,
        .speech-bubble__arrow--br:after {
          border-right: 18px solid transparent;
          border-top: 20px solid white;
          margin-left: 2px;
          margin-top: -5px;
        }

        .speech-bubble__arrow--tl {
          bottom: 100%;
          left: 40px;
          transform: scaleY(-1);
        }

        .speech-bubble__arrow--tr {
          bottom: 100%;
          right: 40px;
          transform: scaleX(-1) scaleY(-1);
        }

        .speech-bubble__arrow--bl {
          left: 40px;
          top: 100%;
        }

        .speech-bubble__arrow--br {
          right: 40px;
          top: 100%;
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default SpeechBubble;
