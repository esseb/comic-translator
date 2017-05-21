// @flow

import fetch from "isomorphic-unfetch";

const apiUrl = process.env.NODE_ENV === "test"
  ? "http://localhost/api"
  : "/api";

type Options = {
  from: string,
  to: string,
  text: string
};

export default function translate(options: Options): Promise<string> {
  // TODO(esseb): Cache responses locally.
  return fetch(`${apiUrl}/translate`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      text: options.text,
      from: "fr",
      to: "en"
    })
  })
    .then(response => response.json())
    .then(response => response.translation);
}
