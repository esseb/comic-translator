// @flow

import React, { Component } from "react";
import type { Element } from "react";

const MOUSE_LEFT = 0;

type Props = {
  previousSlide?: Element<any>,
  currentSlide?: Element<any>,
  nextSlide?: Element<any>
};

type State = {
  isSwiping: boolean,
  isSwipingUsingMouseEvents: boolean,
  isSwipingUsingTouchEvents: boolean,
  swipeStartX: number | null,
  swipeDeltaX: number | null,
  swipeMaxDeltaX: number | null
};

class Swiper extends Component {
  props: Props;
  state: State;
  handleSwipeStart: Function;
  handleSwipeMove: Function;
  handleSwipeEnd: Function;
  element: HTMLElement | null;

  constructor(props: Object) {
    super(props);

    this.state = {
      isSwiping: false,
      isSwipingUsingMouseEvents: false,
      isSwipingUsingTouchEvents: false,
      swipeStartX: null,
      swipeDeltaX: null,
      swipeMaxDeltaX: null
    };

    this.handleSwipeStart = this.handleSwipeStart.bind(this);
    this.handleSwipeMove = this.handleSwipeMove.bind(this);
    this.handleSwipeEnd = this.handleSwipeEnd.bind(this);

    this.element = null;
  }

  componentDidMount() {
    const element = this.element;

    // This code is slightly awkwardly written in order to please Flow...
    if (element) {
      const options = { passive: false };
      element.addEventListener("touchstart", this.handleSwipeStart, options);
      element.addEventListener("touchmove", this.handleSwipeMove, options);
      element.addEventListener("touchend", this.handleSwipeEnd, options);

      element.addEventListener("mousedown", this.handleSwipeStart);
      element.addEventListener("mousemove", this.handleSwipeMove);
      element.addEventListener("mouseup", this.handleSwipeEnd);
    }
  }

  componentWillUnmount() {
    const element = this.element;

    // This code is slightly awkwardly written in order to please Flow...
    if (element) {
      element.removeEventListener("touchstart", this.handleSwipeStart);
      element.removeEventListener("touchmove", this.handleSwipeMove);
      element.removeEventListener("touchend", this.handleSwipeEnd);

      element.removeEventListener("mousedown", this.handleSwipeStart);
      element.removeEventListener("mouseup", this.handleSwipeMove);
      element.removeEventListener("mousemove", this.handleSwipeEnd);
    }
  }

  handleSwipeStart(event: MouseEvent | TouchEvent) {
    if (this.state.isSwiping === true) {
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

    // Prevent text selection.
    event.preventDefault();

    const swipeX = Math.floor(
      event instanceof TouchEvent ? event.touches[0].clientX : 0
    );

    const swipeMaxDeltaX = this.element
      ? this.element.getBoundingClientRect().width
      : 0;

    this.setState({
      isSwiping: true,
      isSwipingUsingMouseEvents: event.type === "mousedown",
      isSwipingUsingTouchEvents: event.type === "touchstart",
      swipeStartX: swipeX,
      swipeDeltaX: 0,
      swipeMaxDeltaX: swipeMaxDeltaX
    });
  }

  handleSwipeMove(event: MouseEvent | TouchEvent) {
    if (this.state.isSwiping === false) {
      return;
    }

    // Prevent text selection.
    event.preventDefault();

    const swipeX = Math.floor(
      event instanceof TouchEvent ? event.touches[0].clientX : 0
    );

    this.setState(state => {
      const swipeDeltaX = state.swipeStartX - swipeX;

      // Don't make it possible to swipe past the edge.
      const swipeDirection = swipeDeltaX / Math.abs(swipeDeltaX);
      const swipeDeltaXCapped =
        swipeDirection * Math.min(state.swipeMaxDeltaX, Math.abs(swipeDeltaX));

      return {
        swipeDeltaX: swipeDeltaXCapped
      };
    });
  }

  handleSwipeEnd(event: MouseEvent | TouchEvent) {
    if (this.state.isSwiping === false) {
      return;
    }

    this.setState({
      isSwiping: false,
      isSwipingUsingMouseEvents: false,
      isSwipingUsingTouchEvents: false,
      swipeStartX: null,
      swipeDeltaX: null,
      swipeMaxDeltaX: null
    });
  }

  renderPreviousSlide() {
    if (this.props.previousSlide === null) {
      return <div className="swiper__slide" aria-hidden="true" inert />;
    }

    return <div className="swiper__slide">{this.props.previousSlide}</div>;
  }

  renderCurrentSlide() {
    return <div className="swiper__slide">{this.props.currentSlide}</div>;
  }

  renderNextSlide() {
    if (this.props.nextSlide === null) {
      return <div className="swiper__slide" aria-hidden="true" inert />;
    }

    return <div className="swiper__slide">{this.props.nextSlide}</div>;
  }

  render() {
    const style = {};

    if (this.state.isSwiping === true) {
      const swipeDeltaX = this.state.swipeDeltaX || 0;
      style.transform = `translateX(calc(${-swipeDeltaX}px))`;
    }

    return (
      <div
        className="swiper"
        ref={element => {
          this.element = element;
        }}
      >
        <div className="swiper__content" style={style}>
          {this.renderPreviousSlide()}
          {this.renderCurrentSlide()}
          {this.renderNextSlide()}
        </div>

        <style global jsx>{`
          .swiper {
            height: 100%;
            left: 0;
            overflow-x: hidden;
            position: absolute;
            top: 0;
            width: 100%;
          }

          .swiper__content {
            align-items: center;
            display: flex;
            flex: 1;
            height: 100%;
            left: -100%;
            position: absolute;
            top: 0;
            width: 300%;
          }

          .swiper__slide {
            display: flex;
            width: calc(300% / 3);
          }
        `}</style>
      </div>
    );
  }
}

export default Swiper;
