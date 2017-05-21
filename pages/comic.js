// @flow

import { Component } from "react";
import slug from "slug";
import { Link } from "../routes";
import Main from "../layout/Main";
import TranslateBubble from "../components/TranslateBubble";
import TranslationDialog from "../components/TranslationDialog";
import translate from "../lib/translate";
import { baseline } from "../variables/spacing";
import comics from "../static/comics.json";

type State = {
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
      originalText: null,
      translatedText: null
    };

    this.handledSelectText = this.handledSelectText.bind(this);
    this.closeTranslationDialog = this.closeTranslationDialog.bind(this);
  }

  handledSelectText(text: string) {
    // TODO(esseb): Only allow one pending translation at a time.
    // TODO(esseb): Handle error - show error dialog.
    translate({ from: "fr", to: "en", text: text }).then(translation => {
      this.setState({
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

  renderBubbleLink(direction: "previous" | "next") {
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

    // Decide which bubble we should link to.
    let bubbleLink = null;
    let bubbleLabel = null;

    if (direction === "previous" && currentBubbleIndex > 0) {
      bubbleLink = bubbleList[currentBubbleIndex - 1];
      bubbleLabel = "Previous bubble";
    }

    if (direction === "next" && currentBubbleIndex < bubbleList.length - 1) {
      bubbleLink = bubbleList[currentBubbleIndex + 1];
      bubbleLabel = "Next bubble";
    }

    if (bubbleLink === null || bubbleLabel === null) {
      return null;
    }

    return (
      <Link
        route="bubble"
        params={{
          slug: slug(comic.title, { lower: true }),
          comicId: comicId,
          pageId: bubbleLink.pageId,
          panelId: bubbleLink.panelId,
          bubbleId: bubbleLink.bubbleId
        }}
      >
        <a>{bubbleLabel}</a>
      </Link>
    );
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
          style={{ backgroundColor: comic.backgroundColor }}
        >
          <div className="comic-page__content">
            <h1 className="comic-page__heading">{comic.title}</h1>
            <a
              className="comic-page__link"
              href={comic.url}
              target="_blank"
              rel="noopener"
            >
              {comic.url}
            </a>

            <div className="comic-page__panel">
              <div className="comic-page__bubble">
                <TranslateBubble
                  text={bubble.text}
                  onSelect={this.handledSelectText}
                />
              </div>
            </div>

            <p>{this.renderBubbleLink("previous")}</p>
            <p>{this.renderBubbleLink("next")}</p>

            <TranslationDialog
              originalText={this.state.originalText}
              translatedText={this.state.translatedText}
              onClose={this.closeTranslationDialog}
            />
          </div>
        </div>

        <style global jsx>{`
          .comic-page {
            min-height: 100%;
          }

          .comic-page__content {
            margin: 0 auto;
            max-width: 600px;
            padding: ${baseline}px 20px;
          }

          .comic-page__heading {
            font-size: 26px;
            font-weight: bold;
            line-height: 30px;
            margin-bottom: ${baseline}px;
          }

          .comic-page__link {
            overflow-wrap: break-word;
            word-wrap: break-word;
          }

          .comic-page__bubble {
            margin: ${baseline}px 0;
          }
        `}</style>
      </Main>
    );
  }
}

export default Comic;
