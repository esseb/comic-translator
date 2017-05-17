// @flow

import Main from "../layout/Main";
import TranslateBubble from "../components/TranslateBubble";

const Comic = () => (
  <Main title="Comic">
    <p>Comic</p>
    <TranslateBubble
      text="Foo bar baz"
      onSelect={text => {
        console.log(text);
      }}
    />
  </Main>
);

export default Comic;
