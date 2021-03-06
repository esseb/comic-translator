// @flow

import { Component } from "react";
import ReactAriaModal from "react-aria-modal";
import classNames from "classnames";
import { BASELINE } from "../variables/spacing";

function getApplicationNode(): HTMLElement | null {
  return document.querySelector("#__next");
}

const ENTER_ANIMATION_DURATION_OVERLAY = 300;
const ENTER_ANIMATION_DURATION_DIALOG = 250;
const EXIT_ANIMATION_DURATION_OVERLAY = 250;
const EXIT_ANIMATION_DURATION_DIALOG = 250;

type Props = {
  status: {
    active: boolean,
    success: boolean,
    error: boolean
  },
  originalText: string | null,
  translatedText: string | null,
  onClose: () => void
};

type State = {
  isEntering: boolean,
  hasEntered: boolean,
  isExiting: boolean,
  hasExited: boolean
};

class TranslationDialog extends Component {
  props: Props;
  state: State;
  handleModalEnter: Function;
  handleModalExit: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      isEntering: false,
      hasEntered: false,
      isExiting: false,
      hasExited: false
    };

    this.handleModalEnter = this.handleModalEnter.bind(this);
    this.handleModalExit = this.handleModalExit.bind(this);
  }

  handleModalEnter() {
    window.requestAnimationFrame(() => {
      this.setState({ isEntering: true }, () => {
        window.requestAnimationFrame(() => {
          this.setState({ hasEntered: true });

          const maxAnimationDuration = Math.max(
            ENTER_ANIMATION_DURATION_OVERLAY,
            ENTER_ANIMATION_DURATION_DIALOG
          );

          // Wait for the entering animation to finish
          // before resetting the entering state.
          setTimeout(() => {
            this.setState({ isEntering: false });
          }, maxAnimationDuration);
        });
      });
    });
  }

  handleModalExit() {
    // Prevent the dialog from closing if we're still in the middle of translating.
    if (this.props.status.active === true) {
      return;
    }

    // Prevent the dialog from closing if the entering animation is still running.
    if (this.state.isEntering === true) {
      return;
    }

    this.setState({ isExiting: true }, () => {
      window.requestAnimationFrame(() => {
        this.setState({ hasExited: true });

        const maxAnimationDuration = Math.max(
          EXIT_ANIMATION_DURATION_OVERLAY,
          EXIT_ANIMATION_DURATION_DIALOG
        );

        // Wait for the exiting animation to finish
        // before resetting the enter/exit states.
        setTimeout(() => {
          this.setState({
            hasEntered: false,
            isExiting: false,
            hasExited: false
          });

          this.props.onClose();
        }, maxAnimationDuration);
      });
    });
  }

  renderBody() {
    if (this.props.status.active === true) {
      return <div className="translation-dialog__body">...</div>;
    }

    if (this.props.status.error === true) {
      return <div className="translation-dialog__body">:(</div>;
    }

    if (this.props.translatedText && this.props.originalText) {
      return (
        <div className="translation-dialog__body">
          <div className="translation-dialog__translation">
            <h2 className="translation-dialog__heading">Translation</h2>
            <p>{this.props.translatedText}</p>
          </div>

          <div className="translation-dialog__original">
            <h2 className="translation-dialog__heading">Original</h2>
            <p>{this.props.originalText}</p>
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <ReactAriaModal
        mounted={
          this.props.status.active ||
            this.props.status.success ||
            this.props.status.error
        }
        titleText="Translation"
        getApplicationNode={getApplicationNode}
        verticallyCenter={true}
        initialFocus="#translation-dialog"
        dialogId="translation-dialog"
        underlayClass={classNames({
          "translation-dialog": true,
          "translation-dialog--is-entering": this.state.isEntering,
          "translation-dialog--has-entered": this.state.hasEntered,
          "translation-dialog--is-exiting": this.state.isExiting,
          "translation-dialog--has-exited": this.state.hasExited
        })}
        dialogClass="translation-dialog__dialog"
        onEnter={this.handleModalEnter}
        onExit={this.handleModalExit}
      >
        <div className="translation-dialog__content">
          <button
            className="translation-dialog__close-button"
            aria-label="Close translation dialog"
            onClick={this.handleModalExit}
          >
            <span>×</span>
          </button>

          {this.renderBody()}
        </div>

        <style global jsx>{`
          .translation-dialog {
            background-color: transparent !important; /* Override the inline style set by react-aria-modal */
            padding: 20px;
          }

          .translation-dialog--is-entering {
            transition: background-color ${ENTER_ANIMATION_DURATION_OVERLAY}ms ease;
          }

          .translation-dialog--has-entered {
            background-color: rgba(0, 0, 0, 0.75) !important;  /* Override the inline style set by react-aria-modal */
            transition: background-color ${ENTER_ANIMATION_DURATION_OVERLAY}ms ease;
          }

          .translation-dialog--is-exiting {
            transition: background-color ${EXIT_ANIMATION_DURATION_OVERLAY}ms ease;
          }

          .translation-dialog--has-exited {
            background-color: transparent !important; /* Override the inline style set by react-aria-modal */
          }

          .translation-dialog__dialog {
            max-width: 600px !important;  /* Override the inline style set by react-aria-modal */
            width: 100%;
          }

          .translation-dialog__content {
            background-color: white;
            border-radius: 5px;
            font-family: Courier, monospace;
            font-size: 24px;
            line-height: 34px;
            opacity: 0;
            padding: 40px;
            position: relative;
            transform: translateY(30px);
          }

          .translation-dialog--is-entering .translation-dialog__content {
            transition:
              opacity ${ENTER_ANIMATION_DURATION_DIALOG}ms ease,
              transform ${ENTER_ANIMATION_DURATION_DIALOG}ms ease;
          }

          .translation-dialog--has-entered .translation-dialog__content {
            opacity: 1;
            transform: initial;
          }

          .translation-dialog--is-exiting .translation-dialog__content {
            transition: opacity ${EXIT_ANIMATION_DURATION_DIALOG}ms ease;
          }

          .translation-dialog--has-exited .translation-dialog__content {
            opacity: 0;
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
            margin-bottom: ${BASELINE}px;
          }

          .translation-dialog__heading {
            font-weight: bold;
          }
        `}</style>
      </ReactAriaModal>
    );
  }
}

export default TranslationDialog;
