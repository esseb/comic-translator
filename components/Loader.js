// @flow

import type { Element } from "React";

const LOADER_CIRCLE_SIZE = 26;
const LOADER_BORDER_SIZE = 3;

const Loader = () => (
  <div className="loader">
    <div className="loader__circle loader__circle--0" />
    <div className="loader__circle loader__circle--1" />
    <div className="loader__circle loader__circle--2" />

    <style global jsx>{`
      .loader {
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
      }

      .loader__circle {
        animation-fill-mode: both;
        animation: loader-animation 1.8s infinite linear;
        background-color: #ffffff;
        border-radius: 50%;
        border: ${LOADER_BORDER_SIZE}px solid #000000;
        height: ${LOADER_CIRCLE_SIZE}px;
        left: 50%;
        margin-top: -${LOADER_CIRCLE_SIZE / 2}px;
        position: absolute;
        top: 50%;
        width: ${LOADER_CIRCLE_SIZE}px;
      }

      .loader__circle--0 {
        animation-delay: -0.32s;
        margin-left: -${LOADER_CIRCLE_SIZE * 2}px;
      }

      .loader__circle--1 {
        animation-delay: -0.16s;
        margin-left: -${LOADER_CIRCLE_SIZE / 2}px;
      }

      .loader__circle--2 {
        animation-delay: 0;
        margin-left: ${LOADER_CIRCLE_SIZE}px;
      }

      @keyframes loader-animation {
        0%,
        80%,
        100% {
          transform-origin: center center;
          transform: scale(1);
        }

        40% {
          transform-origin: center center;
          transform: scale(0);
        }
      }
    `}</style>
  </div>
);

export default Loader;
