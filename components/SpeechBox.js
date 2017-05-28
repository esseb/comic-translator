// @flow

import type { Element } from "React";
import {
  BUBBLE_PADDING_OUTER,
  BUBBLE_PADDING_INNER,
  BUBBLE_BORDER_WIDTH
} from "../variables/spacing";

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
      className={`speech-box__arrow speech-box__arrow--${arrow}`}
    />
  ));
}

const SpeechBox = (props: Props) => {
  return (
    <div className="speech-box">
      <div className="speech-box__content">
        {props.children}
        {renderArrows(props.arrows)}
      </div>

      <style global jsx>{`
        .speech-box {
          padding: ${BUBBLE_PADDING_OUTER}px;
        }

        .speech-box__content {
          background-color: white;
          border: ${BUBBLE_BORDER_WIDTH}px solid black;
          padding: ${BUBBLE_PADDING_INNER}px;
          position: relative;
          text-align: center;
        }

        /*
          Straight arrows,
          all initially styled to point down,
          then mirrored horizontally or vertically if needed
          and absolutely positioned. 
        */
        .speech-box__arrow--t,
        .speech-box__arrow--r,
        .speech-box__arrow--b,
        .speech-box__arrow--l {
          height: 20px;
          position: absolute;
          width: 18px;
        }

        .speech-box__arrow--t:before,
        .speech-box__arrow--r:before,
        .speech-box__arrow--b:before,
        .speech-box__arrow--l:before,
        .speech-box__arrow--t:after,
        .speech-box__arrow--r:after,
        .speech-box__arrow--b:after,
        .speech-box__arrow--l:after {
          content: "";
          display: block;
          position: absolute;
          width: 0;
        }

        .speech-box__arrow--t:before,
        .speech-box__arrow--r:before,
        .speech-box__arrow--b:before,
        .speech-box__arrow--l:before {
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 20px solid black;
        }

        .speech-box__arrow--t:after,
        .speech-box__arrow--r:after,
        .speech-box__arrow--b:after,
        .speech-box__arrow--l:after {
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 20px solid white;
          margin-top: -4px;
        }

        .speech-box__arrow--t {
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) scaleY(-1);
        }

        .speech-box__arrow--r {
          left: 100%;
          margin-left: 1px;  /* Tiny tweak to prevent the black lines from going inside the bubble */
          top: 50%;
          transform: scaleX(-1) translateY(-50%) rotate(90deg);
        }

        .speech-box__arrow--b {
          left: 50%;
          top: 100%;
          transform: translateX(-50%);
        }

        .speech-box__arrow--l {
          margin-right: 1px;  /* Tiny tweak to prevent the black lines from going inside the bubble */
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
        .speech-box__arrow--tl,
        .speech-box__arrow--tr,
        .speech-box__arrow--bl,
        .speech-box__arrow--br {
          height: 20px;
          position: absolute;
          width: 18px;
        }

        .speech-box__arrow--tl:before,
        .speech-box__arrow--tr:before,
        .speech-box__arrow--bl:before,
        .speech-box__arrow--br:before,
        .speech-box__arrow--tl:after,
        .speech-box__arrow--tr:after,
        .speech-box__arrow--bl:after,
        .speech-box__arrow--br:after {
          content: "";
          display: block;
          position: absolute;
          width: 0;
        }

        .speech-box__arrow--tl:before,
        .speech-box__arrow--tr:before,
        .speech-box__arrow--bl:before,
        .speech-box__arrow--br:before {
          border-right: 18px solid transparent;
          border-top: 20px solid black;
        }

        .speech-box__arrow--tl:after,
        .speech-box__arrow--tr:after,
        .speech-box__arrow--bl:after,
        .speech-box__arrow--br:after {
          border-right: 18px solid transparent;
          border-top: 20px solid white;
          margin-left: 2px;
          margin-top: -5px;
        }

        .speech-box__arrow--tl {
          bottom: 100%;
          left: 40px;
          transform: scaleY(-1);
        }

        .speech-box__arrow--tr {
          bottom: 100%;
          right: 40px;
          transform: scaleX(-1) scaleY(-1);
        }

        .speech-box__arrow--bl {
          left: 40px;
          top: 100%;
        }

        .speech-box__arrow--br {
          right: 40px;
          top: 100%;
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default SpeechBox;
