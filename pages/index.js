// @flow

import slugify from "slugify";
import { Link } from "../routes";
import Main from "../layout/Main";
import comics from "../static/comics.json";

const Index = () => (
  <Main>
    <h1>Index</h1>

    <ul>
      {comics.map((comic, index) => (
        <li key={index}>
          <Link
            route="comic"
            params={{
              slug: slugify(comic.title).toLowerCase(),
              comicId: index
            }}
          >
            <a>{comic.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  </Main>
);

export default Index;
