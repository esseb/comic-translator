const fontSize = 16;
import { baseline } from "../variables/spacing";

export default props => (
  <div>
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
        font-size: ${fontSize}px;
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

    {props.children}
  </div>
);
