// @flow

import { Component } from "react";
import ReactModal from "react-modal";
import fetch from "isomorphic-unfetch";
import Main from "../layout/Main";
import TranslateBubble from "../components/TranslateBubble";
import { baseline } from "../variables/spacing";
import comics from "../static/comics.json";

type State = {
  originalText: null | string,
  translatedText: null | string
};

class Comic extends Component {
  state: State;
  handledSelectText: Function;
  closeDialog: Function;

  constructor(props: Object) {
    super(props);

    this.state = {
      originalText: null,
      translatedText: null
    };

    this.handledSelectText = this.handledSelectText.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  handledSelectText(text: string) {
    fetch("/api/translate", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        text: text,
        from: "fr",
        to: "en"
      })
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          originalText: text,
          translatedText: response.translation
        });
      });
  }

  closeDialog() {
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
        <div className="comic-page">
          <h1>{comic.title}</h1>
          <a href={comic.url} target="_blank" rel="noopener">{comic.url}</a>

          {panels.map((panel, index) => (
            <div key={index} className="comic-page__panel">
              {panel.bubbles.map((bubble, index) => (
                <div key={index} className="comic-page__bubble">
                  <TranslateBubble
                    text={bubble.text}
                    onSelect={this.handledSelectText}
                  />
                </div>
              ))}
            </div>
          ))}

          <ReactModal
            isOpen={Boolean(this.state.translatedText)}
            onRequestClose={this.closeDialog}
            contentLabel="Translation"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                bottom: 0,
                left: 0,
                position: "fixed",
                right: 0,
                top: 0
              },
              content: {
                background: "#fff",
                border: 0,
                borderRadius: "5px",
                bottom: "4vw",
                fontFamily: "Courier, monospace",
                left: "4vw",
                outline: "none",
                overflow: "auto",
                padding: "40px 30px 30px 30px",
                position: "absolute",
                right: "4vw",
                top: "4vw",
                WebkitOverflowScrolling: "touch"
              }
            }}
          >
            <button onClick={this.closeDialog} aria-label="close">X</button>

            <h2>Translation</h2>
            <p>{this.state.translatedText}</p>

            <h2>Original text</h2>
            <p>{this.state.originalText}</p>
          </ReactModal>
        </div>

        <style global jsx>{`
          .comic-page {
            margin: 0 auto;
            max-width: 600px;
            padding: ${baseline}px 20px;
          }

          .comic-page > h1 {
            font-size: 26px;
            font-weight: bold;
            line-height: 30px;
            margin-bottom: ${baseline}px;
          }

          .comic-page > a {
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
