import Head from "next/head";

import { defaultFontSize } from "../variables/spacing";
import { baseline } from "../variables/spacing";
import { fontSizeDefault } from "../variables/typography";

const APPLICATION_TITLE = "Comic Translator";

export default props => (
  <div>
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
      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      * {
        font-size: ${fontSizeDefault}px;
        font-weight: normal;
        line-height: ${baseline}px;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: Helvetica, Arial, sans-serif;
        margin: 0;
      }
    `}</style>
  </div>
);
