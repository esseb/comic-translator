// @flow

import Link from "next/link";

import Main from "../layout/Main";

const Index = () => (
  <Main>
    <p>Index</p>

    <Link href="/comic">
      <a>Comic</a>
    </Link>
  </Main>
);

export default Index;
