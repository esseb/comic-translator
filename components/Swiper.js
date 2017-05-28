// @flow

import React, { Component } from "react";
import type { Element } from "react";

const MOUSE_LEFT = 0;
const SLIDE_ANIMATION_DURATION = 250;
const QUICK_SWIPE_MINIMUM_DISTANCE = 20;
const QUICK_SWIPE_MINIMUM_DURATION = 100;

type Props = {
  previousSlide: Element<any> | null,
  currentSlide: Element<any>,
  nextSlide: Element<any> | null,
  onSwipeSuccess: (direction: "previous" | "next") => void
};

type State = {
  isSwiping: boolean,
  isSwipingUsingMouseEvents: boolean,
  isSwipingUsingTouchEvents: boolean,
  swipeStartTime: number | null,
  swipeStartX: number | null,
  swipeDeltaX: number | null,
  isAnimating: boolean,
  animationDirection: -1 | 0 | 1,
  slideWidth: number | null
};

class Swiper extends Component {
  props: Props;
  state: State;
  handleSwipeStart: Function;
  handleSwipeMove: Function;
  handleSwipeEnd: Function;
  handleTransitionEnd: Function;
  element: HTMLElement | null;

  constructor(props: Object) {
    super(props);

    this.state = {
      isSwiping: false,
      isSwipingUsingMouseEvents: false,
      isSwipingUsingTouchEvents: false,
      swipeStartTime: null,
      swipeStartX: null,
      swipeDeltaX: null,
      isAnimating: false,
      animationDirection: 0,
      slideWidth: null
    };

    this.handleSwipeStart = this.handleSwipeStart.bind(this);
    this.handleSwipeMove = this.handleSwipeMove.bind(this);
    this.handleSwipeEnd = this.handleSwipeEnd.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);

    this.element = null;
  }

  componentDidMount() {
    const element = this.element;
    if (element === null) {
      return;
    }

    const options = { passive: false };
    element.addEventListener("touchstart", this.handleSwipeStart, options);
    element.addEventListener("touchmove", this.handleSwipeMove, options);
    element.addEventListener("touchend", this.handleSwipeEnd, options);

    element.addEventListener("mousedown", this.handleSwipeStart);
    element.addEventListener("mousemove", this.handleSwipeMove);
    element.addEventListener("mouseup", this.handleSwipeEnd);

    element.addEventListener("transitionend", this.handleTransitionEnd);
  }

  componentWillUnmount() {
    const element = this.element;
    if (element === null) {
      return;
    }

    element.removeEventListener("touchstart", this.handleSwipeStart);
    element.removeEventListener("touchmove", this.handleSwipeMove);
    element.removeEventListener("touchend", this.handleSwipeEnd);

    element.removeEventListener("mousedown", this.handleSwipeStart);
    element.removeEventListener("mouseup", this.handleSwipeMove);
    element.removeEventListener("mousemove", this.handleSwipeEnd);

    element.removeEventListener("transitionend", this.handleTransitionEnd);
  }

  componentDidUpdate(nextProps: Props) {
    if (this.props.currentSlide !== nextProps.currentSlide) {
      this.setState({
        isAnimating: false,
        animationDirection: 0,
        slideWidth: null
      });
    }
  }

  handleSwipeStart(event: MouseEvent | TouchEvent) {
    this.setState(prevState => {
      if (prevState.isSwiping === true) {
        return prevState;
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

      const swipeX = event instanceof TouchEvent
        ? event.touches[0].clientX
        : event.clientX;

      const slideWidth = this.element
        ? this.element.getBoundingClientRect().width
        : 0;

      return {
        isSwiping: true,
        isSwipingUsingMouseEvents: event.type === "mousedown",
        isSwipingUsingTouchEvents: event.type === "touchstart",
        swipeStartTime: Date.now(),
        swipeStartX: Math.floor(swipeX),
        swipeDeltaX: 0,
        slideWidth: slideWidth
      };
    });
  }

  handleSwipeMove(event: MouseEvent | TouchEvent) {
    this.setState(prevState => {
      if (prevState.isSwiping === false) {
        return prevState;
      }

      // Prevent text selection.
      event.preventDefault();

      const swipeX = event instanceof TouchEvent
        ? event.touches[0].clientX
        : event.clientX;

      // Don't make it possible to swipe greather than the width of one slide.
      let swipeDeltaX = prevState.swipeStartX - Math.floor(swipeX);
      swipeDeltaX =
        Math.min(Math.abs(swipeDeltaX), prevState.slideWidth) *
        Math.sign(swipeDeltaX);

      return {
        swipeDeltaX: swipeDeltaX
      };
    });
  }

  handleSwipeEnd(event: MouseEvent | TouchEvent) {
    this.setState(prevState => {
      if (prevState.isSwiping === false) {
        return prevState;
      }

      // Swipe direction is -1 for previous, 1 for next,
      // or 0 if the user didn't actually end up moving the slide.
      const swipeDirection = Math.sign(prevState.swipeDeltaX);

      // Cancel swiping without doing anything further
      // since we have nothing to animate to.
      if (swipeDirection === 0) {
        return {
          isSwiping: false,
          isSwipingUsingMouseEvents: false,
          isSwipingUsingTouchEvents: false,
          swipeStartTime: null,
          swipeStartX: null,
          swipeDeltaX: null
        };
      }

      // The direction we should animate is opposite of the swipe direction.
      const animationDirection = -swipeDirection;

      // Switch to previous or next slide
      // if the user swiped more than a quarter of the slide width.
      let shouldSwitchSlide =
        Math.abs(prevState.swipeDeltaX) > prevState.slideWidth / 4;

      // Switch slides anyway if the user swiped quickly enough.
      const swipeDeltaTime = Date.now() - prevState.swipeStartTime;
      if (
        Math.abs(prevState.swipeDeltaX) > QUICK_SWIPE_MINIMUM_DISTANCE &&
        swipeDeltaTime < QUICK_SWIPE_MINIMUM_DURATION
      ) {
        shouldSwitchSlide = true;
      }

      // Don't swipe if there are no more slides in the swiped direction.
      if (
        (swipeDirection === -1 && this.props.previousSlide === null) ||
        (swipeDirection === 1 && this.props.nextSlide === null)
      ) {
        shouldSwitchSlide = false;
      }

      return {
        isSwiping: false,
        isSwipingUsingMouseEvents: false,
        isSwipingUsingTouchEvents: false,
        swipeStartTime: null,
        swipeStartX: null,
        swipeDeltaX: null,
        isAnimating: true,
        animationDirection: shouldSwitchSlide ? animationDirection : 0
      };
    });
  }

  handleTransitionEnd(event: TransitionEvent) {
    if (event.type !== "transitionend") {
      return;
    }

    if (this.state.animationDirection !== 0) {
      const swipeDirection = this.state.animationDirection === 1
        ? "previous"
        : "next";

      this.props.onSwipeSuccess(swipeDirection);
    } else {
      this.setState({
        isAnimating: false,
        animationDirection: 0,
        slideWidth: null
      });
    }
  }

  renderSlide(slide: Element<any> | null) {
    if (slide === null) {
      return <div className="swiper__slide" aria-hidden="true" />;
    }

    return <div className="swiper__slide">{slide}</div>;
  }

  render() {
    const style = {};

    if (this.state.isSwiping === true) {
      const translateX = this.state.swipeDeltaX ? -this.state.swipeDeltaX : 0;
      style.transform = `translateX(calc(${translateX}px))`;
    }

    if (this.state.isAnimating === true) {
      const slideWidth = this.state.slideWidth || 0;
      const translateX = this.state.animationDirection * slideWidth;
      style.transform = `translateX(calc(${translateX}px))`;
      style.transition = `transform ${SLIDE_ANIMATION_DURATION}ms`;
    }

    return (
      <div
        className="swiper"
        ref={element => {
          this.element = element;
        }}
      >
        <div className="swiper__content" style={style}>
          {this.renderSlide(this.props.previousSlide)}
          {this.renderSlide(this.props.currentSlide)}
          {this.renderSlide(this.props.nextSlide)}
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
