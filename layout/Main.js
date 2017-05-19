// @flow

import type { Element } from "React";
import Head from "next/head";

import { baseline } from "../variables/spacing";
import { fontSizeDefault } from "../variables/typography";

const APPLICATION_TITLE = "Comic Translator";

type Props = {
  title?: string,
  children?: Element<any>
};

const Main = (props: Props) => (
  <div className="main-layout">
    <Head>
      <title>
        {props.title
          ? `${props.title} - ${APPLICATION_TITLE}`
          : APPLICATION_TITLE}
      </title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    {props.children}

    <style jsx global>{`
      html,
      body,
      body > div:first-of-type,
      body > div:first-of-type > div:first-of-type,
      body > div:first-of-type > div:first-of-type > div,
      .main-layout {
        height: 100%;
        min-height: 100%;
      }

      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      * {
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: Helvetica, Arial, sans-serif;
        font-size: ${fontSizeDefault}px;
        font-weight: normal;
        line-height: ${baseline}px;
        margin: 0;
      }
    `}</style>
  </div>
);

export default Main;
