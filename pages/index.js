// @flow

import React from "react";
import Link from "next/link";

import Main from "../layout/Main";

const Index = (): React.Element<any> => (
  <Main>
    <p>Index</p>

    <Link href="/comic">
      <a>Comic</a>
    </Link>
  </Main>
);

export default Index;
