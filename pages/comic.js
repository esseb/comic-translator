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
import { baseline } from "../variables/spacing";
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

  switchBubble(direction: "previous" | "next") {
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
    const slug = slugify(comic.title).toLowerCase();

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
      const previousBubble = bubbleList[currentBubbleIndex - 1];

      Router.replaceRoute("bubble", {
        slug: slug,
        comicId: comicId,
        pageId: previousBubble.pageId,
        panelId: previousBubble.panelId,
        bubbleId: previousBubble.bubbleId
      });

      return;
    }

    if (direction === "next" && currentBubbleIndex < bubbleList.length - 1) {
      const nextBubble = bubbleList[currentBubbleIndex + 1];

      Router.replaceRoute("bubble", {
        slug: slug,
        comicId: comicId,
        pageId: nextBubble.pageId,
        panelId: nextBubble.panelId,
        bubbleId: nextBubble.bubbleId
      });

      return;
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
    const bubble = comic.pages[pageId].panels[panelId].bubbles[bubbleId];

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
              previousSlide={
                <div className="comic-page__bubble">
                  <TranslationBubble
                    type={bubble.type || SPEECH_BUBBLE}
                    text="Previous"
                    arrows={bubble.arrows}
                    onSelect={this.handledSelectText}
                  />
                </div>
              }
              currentSlide={
                <div className="comic-page__bubble">
                  <TranslationBubble
                    type={bubble.type || SPEECH_BUBBLE}
                    text={bubble.text}
                    arrows={bubble.arrows}
                    onSelect={this.handledSelectText}
                  />
                </div>
              }
              nextSlide={
                <div className="comic-page__bubble">
                  <TranslationBubble
                    type={bubble.type || SPEECH_BUBBLE}
                    text="Next"
                    arrows={bubble.arrows}
                    onSelect={this.handledSelectText}
                  />
                </div>
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
