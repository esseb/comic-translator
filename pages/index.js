// @flow

import slugify from "slugify";
import { Link } from "../routes";
import Main from "../layout/Main";
import comics from "../static/comics.json";

const Index = () => (
  <Main>
    <h1>Index</h1>

    <ul>
      <li>
        <Link
          route="comic"
          params={{ slug: slugify(comics[0].title).toLowerCase(), comicId: 0 }}
        >
          <a>Comic</a>
        </Link>
      </li>

      <li>
        <Link
          route="bubble"
          params={{
            slug: slugify(comics[0].title).toLowerCase(),
            comicId: 0,
            pageId: 0,
            panelId: 0,
            bubbleId: 1
          }}
        >
          <a>comic 0, page 0, panel 0, bubble 1</a>
        </Link>
      </li>
    </ul>
  </Main>
);

export default Index;
