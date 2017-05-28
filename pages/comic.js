// @flow

import { Component } from "react";
import slugify from "slugify";
import classNames from "classnames";
import { Router, Link } from "../routes";
import Main from "../layout/Main";
import TranslationBubble, {
  SPEECH_BUBBLE
} from "../components/TranslationBubble";
import TranslationDialog from "../components/TranslationDialog";
import Swiper from "../components/Swiper";
import translate from "../lib/translate";
import comics from "../static/comics.json";

// How long to delay, in ms, before showing the loading animation
// to show that we're waiting for the translation request to finish.
// We don't want to show this immediately because it looks a bit ugly
// if it appears and disappears immediately.
const TRANSLATING_LOADING_ANIMATION_DELAY = 500;

type State = {
  translationStatus: {
    active: boolean,
    success: boolean,
    error: boolean
  },
  originalText: null | string,
  translatedText: null | string
};

class Comic extends Component {
  state: State;
  handledSelectText: Function;
  closeTranslationDialog: Function;
  switchBubble: Function;

  constructor(props: Object) {
    super(props);

    this.state = {
      translationStatus: {
        active: false,
        success: false,
        error: false
      },
      originalText: null,
      translatedText: null
    };

    this.handledSelectText = this.handledSelectText.bind(this);
    this.closeTranslationDialog = this.closeTranslationDialog.bind(this);
    this.switchBubble = this.switchBubble.bind(this);
  }

  handledSelectText(text: string) {
    this.setState(state => ({
      translationStatus: { active: true, success: false, error: false },
      originalText: text
    }));

    // TODO(esseb): Only allow one pending translation at a time.
    // TODO(esseb): Handle error - show error dialog.
    translate({ from: "fr", to: "en", text: text }).then(translation => {
      this.setState({
        translationStatus: { active: false, success: true, error: false },
        originalText: text,
        translatedText: translation
      });
    });
  }

  closeTranslationDialog() {
    // TODO(esseb): Clear the selected text after closing the dialog,
    //   not before as we do now.
    this.setState({
      translationStatus: { active: false, success: false, error: false },
      originalText: null,
      translatedText: null
    });
  }

  getBubble(
    direction: "previous" | "next"
  ):
    | {
        pageId: number,
        panelId: number,
        bubbleId: number
      }
    | null {
    let {
      comicId,
      pageId = 0,
      panelId = 0,
      bubbleId = 0
    } = this.props.url.query;

    comicId = parseInt(comicId, 10);
    pageId = parseInt(pageId, 10);
    panelId = parseInt(panelId, 10);
    bubbleId = parseInt(bubbleId, 10);

    const comic = comics[comicId];

    // Collect all the bubbles with relevant route ids in a single list.
    const bubbleList = [];
    comic.pages.forEach((page, pageId) => {
      page.panels.forEach((panel, panelId) => {
        panel.bubbles.forEach((bubble, bubbleId) => {
          bubbleList.push({ pageId, panelId, bubbleId });
        });
      });
    });

    // Find the currently active bubble in the bubbles list.
    const currentBubbleIndex = bubbleList.findIndex(bubble => {
      return (
        bubble.pageId === pageId &&
        bubble.panelId === panelId &&
        bubble.bubbleId === bubbleId
      );
    });

    if (direction === "previous" && currentBubbleIndex > 0) {
      return bubbleList[currentBubbleIndex - 1];
    }

    if (direction === "next" && currentBubbleIndex < bubbleList.length - 1) {
      return bubbleList[currentBubbleIndex + 1];
    }

    return null;
  }

  switchBubble(direction: "previous" | "next") {
    let { comicId } = this.props.url.query;

    comicId = parseInt(comicId, 10);

    const comic = comics[comicId];
    const slug = slugify(comic.title).toLowerCase();

    const targetBubble = this.getBubble(direction);
    if (targetBubble !== null) {
      Router.replaceRoute("bubble", {
        slug: slug,
        comicId: comicId,
        pageId: targetBubble.pageId,
        panelId: targetBubble.panelId,
        bubbleId: targetBubble.bubbleId
      });
    }
  }

  render() {
    let {
      comicId,
      pageId = 0,
      panelId = 0,
      bubbleId = 0
    } = this.props.url.query;

    comicId = parseInt(comicId, 10);
    pageId = parseInt(pageId, 10);
    panelId = parseInt(panelId, 10);
    bubbleId = parseInt(bubbleId, 10);

    const comic = comics[comicId];
    const currentBubble = comic.pages[pageId].panels[panelId].bubbles[bubbleId];

    let previousBubble = null;
    const previousBubbleData = this.getBubble("previous");
    if (previousBubbleData !== null) {
      previousBubble =
        comic.pages[previousBubbleData.pageId].panels[
          previousBubbleData.panelId
        ].bubbles[previousBubbleData.bubbleId];
    }

    let nextBubble = null;
    const nextBubbleData = this.getBubble("next");
    if (nextBubbleData !== null) {
      nextBubble =
        comic.pages[nextBubbleData.pageId].panels[nextBubbleData.panelId]
          .bubbles[nextBubbleData.bubbleId];
    }

    return (
      <Main title={comic.title}>
        <div
          className="comic-page"
          style={{ backgroundColor: comic.color || "skyblue" }}
        >
          <div className="comic-page__header">
            <Link route="index">
              <a className="comic-page__home-link">⬅</a>
            </Link>

            <h1 className="comic-page__heading">
              <a href={comic.url} target="_blank" rel="noopener">
                {comic.title}
              </a>
            </h1>
          </div>

          <div className="comic-page__body">
            <Swiper
              onSwipeSuccess={this.switchBubble}
              previousSlide={
                previousBubble
                  ? <div className="comic-page__bubble">
                      <TranslationBubble
                        type={previousBubble.type || SPEECH_BUBBLE}
                        text={previousBubble.text}
                        arrows={previousBubble.arrows}
                        onSelect={(text: string) => {}}
                      />
                    </div>
                  : null
              }
              currentSlide={
                <div className="comic-page__bubble">
                  <TranslationBubble
                    type={currentBubble.type || SPEECH_BUBBLE}
                    text={currentBubble.text}
                    arrows={currentBubble.arrows}
                    onSelect={this.handledSelectText}
                  />
                </div>
              }
              nextSlide={
                nextBubble
                  ? <div className="comic-page__bubble">
                      <TranslationBubble
                        type={nextBubble.type || SPEECH_BUBBLE}
                        text={nextBubble.text}
                        arrows={nextBubble.arrows}
                        onSelect={(text: string) => {}}
                      />
                    </div>
                  : null
              }
            />

            <TranslationDialog
              status={this.state.translationStatus}
              originalText={this.state.originalText}
              translatedText={this.state.translatedText}
              onClose={this.closeTranslationDialog}
            />
          </div>
        </div>

        <style global jsx>{`
          .comic-page {
            display: flex;
            flex-direction: column;
            min-height: 100%;
          }

          .comic-page__header {
            background-color: white;
          }

          .comic-page__body {
            flex: 1;
            position: relative;
          }

          .comic-page__home-link {
            color: inherit;
            display: block;
            font-size: 24px;
            font-weight: bold;
            left: 0;
            line-height: 36px;
            padding: 7px 5px 0 5px;
            position: absolute;
            text-decoration: none;
            top: 0;
          }

          .comic-page__heading {
            font-size: 22px;
            font-weight: bold;
            line-height: 36px;
            margin: 0;
            text-align: center;
          }

          .comic-page__heading > a {
            border-bottom: 2px solid black;
            color: inherit;
            display: block;
            padding-bottom: 5px;
            padding-left: 36px;
            padding-right: 36px;
            padding-top: 5px;
            text-decoration: none;
          }

          .comic-page__bubble {
            display: inline-block;
            margin: 0 auto;
            max-width: 500px;
            min-width: 150px;
          }
        `}</style>
      </Main>
    );
  }
}

export default Comic;
