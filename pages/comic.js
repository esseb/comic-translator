// @flow

import Main from "../layout/Main";
import SelectableWords from "../components/SelectableWords";

const Comic = () => (
  <Main title="Comic">
    <p>Comic</p>
    <SelectableWords
      text="Foo bar baz"
      onSelect={text => {
        console.log(text);
      }}
    />
  </Main>
);

export default Comic;
