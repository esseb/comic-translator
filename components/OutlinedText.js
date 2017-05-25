// @flow

import type { Element } from "React";

type Props = {
  children?: Element<any>
};

const OutlinedText = (props: Props) => (
  <div className="outlined-text">
    {props.children}

    <span className="outlined-text__text-stroke" aria-hidden="true">
      {props.children}
    </span>

    <style global jsx>{`
      .outlined-text {
        color: white;
        position: relative;
        text-align: center;
        z-index: 0;
      }

      .outlined-text__text-stroke {
        left: 0;
        position: absolute;
        right: 0;
        -webkit-text-stroke: 7px black;
        text-stroke: 7px black;
        top: 0;
        user-select: none;
        z-index: -1;
      }
    `}</style>
  </div>
);

export default OutlinedText;
