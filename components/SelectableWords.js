// @flow

import { Component } from "react";
import classNames from "classnames";

type Props = {
  text: string,
  onSelect: (text: string) => void
};

type State = {
  isSelecting: boolean,
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
      selectionInitial: null,
      selectionStart: null,
      selectionEnd: null
    };
  }

  handleSelectStart(event: SyntheticInputEvent) {
    let index = event.target.dataset.wordIndex;
    if (typeof index === "undefined") {
      return;
    }

    index = parseInt(index, 10);
    this.setState({
      isSelecting: true,
      selectionInitial: index,
      selectionStart: index,
      selectionEnd: index
    });
  }

  handleSelectMove(event: SyntheticInputEvent) {
    if (this.state.isSelecting === false) {
      return;
    }

    let index = event.target.dataset.wordIndex;
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

  handleSelectEnd(event: SyntheticInputEvent) {
    // If anything was selected,
    // call the `onSelect` prop with the selected text.
    const words = this.props.text.split(/\s/);
    const { selectionStart, selectionEnd } = this.state;
    if (selectionStart !== null && selectionEnd !== null) {
      const text = words.slice(selectionStart, selectionEnd + 1).join(" ");
      this.props.onSelect(text);
    }

    this.setState({
      isSelecting: false,
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
        onMouseMove={this.handleSelectMove.bind(this)}
        onMouseUp={this.handleSelectEnd.bind(this)}
      >
        {words.map((word, index) => [this.renderWord(word, index), " "])}

        <style jsx global>{`
          .selectable-words {
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
