// @flow

import nock from "nock";
import translate from "./translate";

describe("translate function", () => {
  afterEach(() => {
    nock.restore();
  });

  it("should translate from French to English", () => {
    nock("http://localhost")
      .post("/api/translate", { from: "fr", to: "en", text: "Elle a un chat" })
      .reply(200, { translation: "She has a cat" });

    expect.assertions(1);
    return expect(
      translate({ from: "fr", to: "en", text: "Elle a un chat" })
    ).resolves.toEqual("She has a cat");
  });
});
