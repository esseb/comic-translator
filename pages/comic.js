// @flow

import { Component } from "react";
import slugify from "slugify";
import classNames from "classnames";
import { Router, Link } from "../routes";
import Main from "../layout/Main";
import TranslateBubble from "../components/TranslateBubble";
import TranslationDialog from "../components/TranslationDialog";
import Loader from "../components/Loader";
import translate from "../lib/translate";
import { baseline } from "../variables/spacing";
import comics from "../static/comics.json";

// How long to delay, in ms, before showing the loading animation
// to show that we're waiting for the translation request to finish.
// We don't want to show this immediately because it looks a bit ugly
// if it appears and disappears immediately.
const TRANSLATING_LOADING_ANIMATION_DELAY = 500;

type State = {
  isTranslating: boolean,
  showTranslationAnimation: boolean,
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
      isTranslating: false,
      showTranslationAnimation: false,
      originalText: null,
      translatedText: null
    };

    this.handledSelectText = this.handledSelectText.bind(this);
    this.closeTranslationDialog = this.closeTranslationDialog.bind(this);
  }

  handledSelectText(text: string) {
    this.setState({
      isTranslating: true,
      showTranslationAnimation: false
    });

    setTimeout(() => {
      this.setState({ showTranslationAnimation: true });
    }, TRANSLATING_LOADING_ANIMATION_DELAY);

    // TODO(esseb): Only allow one pending translation at a time.
    // TODO(esseb): Handle error - show error dialog.
    translate({ from: "fr", to: "en", text: text }).then(translation => {
      this.setState({
        isTranslating: false,
        showTranslationAnimation: false,
        originalText: text,
        translatedText: translation
      });
    });
  }

  closeTranslationDialog() {
    // TODO(esseb): Clear the selected text after closing the dialog,
    //   not before as we do now.
    this.setState({
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
        <div className="comic-page" style={{ backgroundColor: comic.color }}>
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
            <button
              className={classNames(
                "comic-page__navigation-button",
                "comic-page__navigation-button--previous"
              )}
              onClick={() => {
                this.switchBubble("previous");
              }}
            >
              Previous bubble
            </button>

            <button
              className={classNames(
                "comic-page__navigation-button",
                "comic-page__navigation-button--next"
              )}
              onClick={() => {
                this.switchBubble("next");
              }}
            >
              Next bubble
            </button>

            <div className="comic-page__bubble">
              <TranslateBubble
                text={bubble.text}
                arrows={bubble.arrows}
                onSelect={this.handledSelectText}
              />
            </div>

            <TranslationDialog
              originalText={this.state.originalText}
              translatedText={this.state.translatedText}
              onClose={this.closeTranslationDialog}
            />

            {this.state.isTranslating && this.state.showTranslationAnimation
              ? <Loader />
              : null}
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
            align-items: center;
            display: flex;
            flex: 1;
            justify-content: center;
            padding: 0 5px;
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

          .comic-page__navigation-button {
            background-color: transparent;
            border: 0;
            bottom: 0;
            opacity: 0;
            position: absolute;
            top: 0;
            width: 50%;
          }

          .comic-page__navigation-button--previous {
            left: 0;
          }

          .comic-page__navigation-button--next {
            right: 0;
          }

          .comic-page__bubble {
            margin: 0 auto;
            max-width: 500px;
            min-width: 100px;
          }
        `}</style>
      </Main>
    );
  }
}

export default Comic;
