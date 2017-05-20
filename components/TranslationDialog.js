// @flow

import ReactModal from "react-modal";

type Props = {
  onClose: () => void,
  originalText: string | null,
  translatedText: string | null
};

const TranslationDialog = (props: Props) => (
  <ReactModal
    isOpen={props.originalText !== null && props.translatedText !== null}
    onRequestClose={props.onClose}
    contentLabel="Translation"
    style={{
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        bottom: 0,
        left: 0,
        position: "fixed",
        right: 0,
        top: 0
      },
      content: {
        background: "#fff",
        border: 0,
        borderRadius: "5px",
        bottom: "4vw",
        fontFamily: "Courier, monospace",
        left: "4vw",
        outline: "none",
        overflow: "auto",
        padding: "40px 30px 30px 30px",
        position: "absolute",
        right: "4vw",
        top: "4vw",
        WebkitOverflowScrolling: "touch"
      }
    }}
  >
    <button onClick={props.onClose} aria-label="Close translation dialog">
      X
    </button>

    <h2>Translation</h2>
    <p>{props.translatedText}</p>

    <h2>Original text</h2>
    <p>{props.originalText}</p>
  </ReactModal>
);

export default TranslationDialog;
