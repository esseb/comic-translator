// @flow

import Main from "../layout/Main";
import TranslateBubble from "../components/TranslateBubble";
import { baseline } from "../variables/spacing";
import comics from "../static/comics.json";

const comic = comics[0];
const panels = comic.pages[0].panels;

const translate = text => {
  window.open(`https://translate.google.no/m/translate#fr/en/${text}`);
};

const Comic = () => (
  <Main title={comic.title}>
    <div className="comic-page">
      <h1>{comic.title}</h1>
      <a href={comic.url} target="_blank" rel="noopener">{comic.url}</a>

      {panels.map((panel, index) => (
        <div key={index} className="comic-page__panel">
          {panel.bubbles.map((bubble, index) => (
            <div key={index} className="comic-page__bubble">
              <TranslateBubble text={bubble.text} onSelect={translate} />
            </div>
          ))}
        </div>
      ))}
    </div>

    <style global jsx>{`
      .comic-page {
        margin: 0 auto;
        max-width: 600px;
        padding: ${baseline} 20px;
      }

      .comic-page > h1 {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: ${baseline * 1}px;
        margin-top: ${baseline * 2}px;
      }

      .comic-page__panel {
        margin-top: ${baseline * 3}px;
      }

      .comic-page__bubble {
        margin-bottom: ${baseline}px;
      }
    `}</style>
  </Main>
);

export default Comic;
