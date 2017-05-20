// @flow

import ReactAriaModal from "react-aria-modal";
import { baseline } from "../variables/spacing";

type Props = {
  onClose: () => void,
  originalText: string | null,
  translatedText: string | null
};

const TranslationDialog = (props: Props) => {
  function getApplicationNode() {
    return document.querySelector("#__next");
  }

  return (
    <ReactAriaModal
      mounted={props.originalText !== null && props.translatedText !== null}
      titleText="Translation"
      getApplicationNode={getApplicationNode}
      verticallyCenter={true}
      initialFocus="#translation-dialog"
      dialogId="translation-dialog"
      underlayClass="translation-dialog"
      dialogClass="translation-dialog__dialog"
      onExit={props.onClose}
    >
      <div className="translation-dialog__content">
        <button
          className="translation-dialog__close-button"
          aria-label="Close translation dialog"
          onClick={props.onClose}
        >
          <span>×</span>
        </button>

        <div className="translation-dialog__translation">
          <h2 className="translation-dialog__heading">Translation</h2>
          <p>{props.translatedText}</p>
        </div>

        <div className="translation-dialog__original">
          <h2 className="translation-dialog__heading">Original</h2>
          <p>{props.originalText}</p>
        </div>
      </div>

      <style global jsx>{`
        .translation-dialog {
          padding: 20px;
        }

        .translation-dialog__content {
          background-color: white;
          border-radius: 5px;
          font-family: Courier, monospace;
          font-size: 24px;
          line-height: 34px;
          padding: 40px;
          position: relative;
        }

        .translation-dialog__close-button {
          background-color: transparent;
          border: 0;
          font-size: 40px;
          height: 50px;
          line-height: 50px;
          position: absolute;
          right: 0;
          text-align: center;
          top: 0;
          width: 50px;
        }

        .translation-dialog__close-button > span {
          left: 0;
          line-height: 1;
          position: absolute;
          text-align: center;
          top: 3px;
          width: 100%;
        }

        .translation-dialog__translation {
          margin-bottom: ${baseline}px;
        }

        .translation-dialog__heading {
          font-weight: bold;
        }
      `}</style>
    </ReactAriaModal>
  );
};

export default TranslationDialog;
