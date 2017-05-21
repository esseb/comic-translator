// @flow

import { Component } from "react";
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

  render() {
    const comic = comics[0];
    const panels = comic.pages[0].panels;

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
                  text={panels[0].bubbles[0].text}
                  onSelect={this.handledSelectText}
                />
              </div>
            </div>

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
