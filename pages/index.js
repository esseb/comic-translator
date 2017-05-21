// @flow

import slug from "slug";
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
          params={{ slug: slug(comics[0].title, { lower: true }), comicId: 0 }}
        >
          <a>Comic</a>
        </Link>
      </li>

      <li>
        <Link
          route="bubble"
          params={{
            slug: slug(comics[0].title, { lower: true }),
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
