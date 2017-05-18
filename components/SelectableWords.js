// @flow

import { Component } from "react";
import classNames from "classnames";

const MOUSE_LEFT = 0;

type Props = {
  text: string,
  onSelect: (text: string) => void
};

type State = {
  isSelecting: boolean,
  isSelectingUsingMouseEvents: boolean,
  isSelectingUsingTouchEvents: boolean,
  selectionInitial: null | number,
  selectionStart: null | number,
  selectionEnd: null | number
};

class SelectableWords extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSelecting: false,
      isSelectingUsingMouseEvents: false,
      isSelectingUsingTouchEvents: false,
      selectionInitial: null,
      selectionStart: null,
      selectionEnd: null
    };
  }

  handleSelectStart(event: SyntheticInputEvent | SyntheticTouchEvent) {
    if (this.state.isSelecting === true) {
      return;
    }

    if (event.type === "mousedown") {
      // We only care about the left mouse button.
      if (event.button !== MOUSE_LEFT) {
        return;
      }

      // Do nothing if any modifiers were used.
      if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }
    }

    let index = event.target.dataset.wordIndex;
    if (typeof index === "undefined") {
      return;
    }

    index = parseInt(index, 10);
    this.setState({
      isSelecting: true,
      isSelectingUsingMouseEvents: event.type === "mousedown",
      isSelectingUsingTouchEvents: event.type === "touchstart",
      selectionInitial: index,
      selectionStart: index,
      selectionEnd: index
    });
  }

  handleSelectMove(event: SyntheticInputEvent | SyntheticTouchEvent) {
    if (this.state.isSelecting === false) {
      return;
    }

    // We don't care about mouse events
    // if the selection was started with a touch event.
    if (this.state.isSelectingUsingTouchEvents && event.type === "mousedown") {
      return;
    }

    const x = event.touches && event.touches.length
      ? event.touches[0].clientX
      : event.clientX;
    const y = event.touches && event.touches.length
      ? event.touches[0].clientY
      : event.clientY;
    const target = document.elementFromPoint(x, y);

    let index = target.dataset.wordIndex;
    if (typeof index === "undefined") {
      return;
    }

    index = parseInt(index, 10);
    const { selectionInitial } = this.state;

    this.setState({
      selectionStart: Math.min(selectionInitial || 0, index),
      selectionEnd: Math.max(selectionInitial || 0, index)
    });
  }

  handleSelectEnd(event: SyntheticInputEvent | SyntheticTouchEvent) {
    if (this.state.isSelecting === false) {
      return;
    }

    // Call the `onSelect` prop with the selected text
    // if anything was selected.
    const words = this.props.text.split(/\s/);
    const { selectionStart, selectionEnd } = this.state;
    if (selectionStart !== null && selectionEnd !== null) {
      const text = words.slice(selectionStart, selectionEnd + 1).join(" ");
      this.props.onSelect(text);
    }

    this.setState({
      isSelecting: false,
      isSelectingUsingMouseEvents: false,
      isSelectingUsingTouchEvents: false,
      selectionInitial: null,
      selectionStart: null,
      selectionEnd: null
    });
  }

  renderWord(word: string, index: number) {
    const { selectionStart, selectionEnd } = this.state;

    // Check if the word index is between the start and end selection.
    let selected = false;
    if (selectionStart !== null && selectionEnd !== null) {
      selected = index >= selectionStart && index <= selectionEnd;
    }

    const classes = classNames({
      "selectable-words__word": true,
      "selectable-words__word--selection": selected,
      "selectable-words__word--selection-start": index === selectionStart,
      "selectable-words__word--selection-end": index === selectionEnd
    });

    return <span className={classes} data-word-index={index}>{word}</span>;
  }

  render() {
    const words = this.props.text.split(/\s/);

    return (
      <div
        className="selectable-words"
        onMouseDown={this.handleSelectStart.bind(this)}
        onTouchStart={this.handleSelectStart.bind(this)}
        onMouseMove={this.handleSelectMove.bind(this)}
        onTouchMove={this.handleSelectMove.bind(this)}
        onMouseUp={this.handleSelectEnd.bind(this)}
        onTouchEnd={this.handleSelectEnd.bind(this)}
      >
        {words.map((word, index) => [this.renderWord(word, index), " "])}

        <style global jsx>{`
          .selectable-words {
            font-size: 18px;
            line-height: 30px;
            user-select: none;
          }

          .selectable-words__word {
            cursor: pointer;
            display: inline-block;
            position: relative;
            z-index: 0;
          }

          .selectable-words__word--selection {
            background-color: powderblue;
          }

          .selectable-words__word--selection:before,
          .selectable-words__word--selection:after {
            background-color: powderblue;
            bottom: 0;
            content: "";
            display: block;
            position: absolute;
            top: 0;
            width: 3px;
          }

          .selectable-words__word--selection:before {
            left: -3px;
          }

          .selectable-words__word--selection:after {
            right: -3px;
          }

          .selectable-words__word--selection-start:before {
            border-radius: 50% 0 0 50%;
          }

          .selectable-words__word--selection-end:after {
            border-radius: 0 50% 50% 0;
          }
        `}</style>
      </div>
    );
  }
}

export default SelectableWords;
