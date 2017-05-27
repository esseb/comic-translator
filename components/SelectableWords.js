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
  selectionStart: null | number,
  selectionEnd: null | number
};

class SelectableWords extends Component {
  props: Props;
  state: State;
  handleSelectStart: Function;
  handleSelectMove: Function;
  handleSelectEnd: Function;
  element: HTMLElement | null;
  wordElements: Array<HTMLElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSelecting: false,
      isSelectingUsingMouseEvents: false,
      isSelectingUsingTouchEvents: false,
      selectionStart: null,
      selectionEnd: null
    };

    this.handleSelectStart = this.handleSelectStart.bind(this);
    this.handleSelectMove = this.handleSelectMove.bind(this);
    this.handleSelectEnd = this.handleSelectEnd.bind(this);

    this.element = null;
    this.wordElements = [];
  }

  componentDidMount() {
    const element = this.element;

    // This code is slightly awkwardly written in order to please Flow...
    if (element) {
      const options = { passive: false };
      element.addEventListener("touchstart", this.handleSelectStart, options);
      element.addEventListener("touchmove", this.handleSelectMove, options);
      element.addEventListener("touchend", this.handleSelectEnd, options);

      element.addEventListener("mousedown", this.handleSelectStart);
      element.addEventListener("mousemove", this.handleSelectMove);
      element.addEventListener("mouseup", this.handleSelectEnd);
    }
  }

  componentWillUnmount() {
    const element = this.element;

    // This code is slightly awkwardly written in order to please Flow...
    if (element) {
      element.removeEventListener("touchstart", this.handleSelectStart);
      element.removeEventListener("touchend", this.handleSelectMove);
      element.removeEventListener("touchmove", this.handleSelectEnd);

      element.removeEventListener("mousedown", this.handleSelectStart);
      element.removeEventListener("mouseup", this.handleSelectMove);
      element.removeEventListener("mousemove", this.handleSelectEnd);
    }
  }

  handleSelectStart(event: MouseEvent | TouchEvent) {
    if (this.state.isSelecting === true) {
      return;
    }

    if (event instanceof MouseEvent) {
      // We only care about the left mouse button.
      if (event.button !== MOUSE_LEFT) {
        return;
      }

      // Do nothing if any modifiers were used.
      if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }
    }

    const target = getElementFromEventPosition(event);
    if (target === null) {
      return;
    }

    const wordIndex = this.wordElements.findIndex(word => word === target);
    if (wordIndex === -1) {
      return;
    }

    // Prevent text selection.
    event.preventDefault();

    // Stop Swiper from swiping...
    event.stopPropagation();

    this.setState({
      isSelecting: true,
      isSelectingUsingMouseEvents: event.type === "mousedown",
      isSelectingUsingTouchEvents: event.type === "touchstart",
      selectionStart: wordIndex,
      selectionEnd: wordIndex
    });
  }

  handleSelectMove(event: MouseEvent | TouchEvent) {
    if (this.state.isSelecting === false) {
      return;
    }

    // We don't care about mouse events
    // if the selection was started with a touch event.
    if (this.state.isSelectingUsingTouchEvents && event.type === "mousedown") {
      return;
    }

    // Prevent text selection.
    event.preventDefault();

    // Stop Swiper from swiping...
    event.stopPropagation();

    const target = getElementFromEventPosition(event);
    if (target === null) {
      return;
    }

    const wordIndex = this.wordElements.findIndex(word => word === target);
    if (wordIndex === -1) {
      return;
    }

    this.setState({ selectionEnd: wordIndex });
  }

  handleSelectEnd(event: MouseEvent | TouchEvent) {
    if (this.state.isSelecting === false) {
      return;
    }

    // We don't care about mouse events
    // if the selection was started with a touch event.
    if (this.state.isSelectingUsingTouchEvents && event.type === "mousedown") {
      return;
    }

    // Prevent text selection.
    event.preventDefault();

    // Stop Swiper from swiping...
    event.stopPropagation();

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

    return (
      <span
        className={classNames({
          "selectable-words__word": true,
          "selectable-words__word--selection": selected,
          "selectable-words__word--selection-start": index === selectionStart,
          "selectable-words__word--selection-end": index === selectionEnd
        })}
        ref={ref => {
          this.wordElements[index] = ref;
        }}
      >
        {word}
      </span>
    );
  }

  render() {
    const words = this.props.text.split(/\s/);

    return (
      <div
        className="selectable-words"
        ref={element => {
          this.element = element;
        }}
      >
        {words.map((word, index) => [this.renderWord(word, index), " "])}

        <style global jsx>{`
          .selectable-words {
            user-select: none;
          }

          .selectable-words__word {
            cursor: pointer;
            display: inline-block;
            position: relative;
            z-index: 0;
          }

          .selectable-words__word--selection:before {
            background-color: powderblue;
            bottom: 1px;
            content: "";
            display: block;
            left: -4px;
            position: absolute;
            right: -4px;
            top: 1px;
            z-index: -1;
          }

          .selectable-words__word--selection-start:before {
            border-radius: 3px 0 0 3px;
          }

          .selectable-words__word--selection-end:before {
            border-radius: 0 3px 3px 0;
          }

          .selectable-words__word--selection-start.selectable-words__word--selection-end:before {
            border-radius: 3px 3px 3px 3px;
          }
        `}</style>
      </div>
    );
  }
}

function getElementFromEventPosition(
  event: MouseEvent | TouchEvent
): HTMLElement | null {
  if (event instanceof MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    return document.elementFromPoint(x, y);
  }

  if (event instanceof TouchEvent) {
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    return document.elementFromPoint(x, y);
  }

  return null;
}

export default SelectableWords;
