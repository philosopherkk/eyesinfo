import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PUBLIC_ORIGIN } from "./site.ts";
import { absolutePublicUrl, sharePayload } from "./share.ts";

describe("absolutePublicUrl", () => {
  it("uses PUBLIC_ORIGIN, not a relative or preview host", () => {
    const url = absolutePublicUrl("/t/t-cataract");
    assert.equal(url, `${PUBLIC_ORIGIN}/t/t-cataract`);
    assert.match(url, /^https:\/\/www\.eyesinfo\.org\//);
    assert.doesNotMatch(url, /localhost|vercel\.app/i);
  });

  it("keeps locale query on the public origin", () => {
    assert.equal(
      absolutePublicUrl("/t/t-cataract?lang=en"),
      `${PUBLIC_ORIGIN}/t/t-cataract?lang=en`,
    );
    assert.equal(
      absolutePublicUrl("/tools/procedures?procedure=rrd&lang=ja"),
      `${PUBLIC_ORIGIN}/tools/procedures?procedure=rrd&lang=ja`,
    );
  });
});

describe("sharePayload", () => {
  it("is page title plus 護眼學堂", () => {
    const p = sharePayload("白內障", "https://www.eyesinfo.org/t/t-cataract");
    assert.equal(p.title, "白內障｜護眼學堂");
    assert.equal(p.text, "白內障 · 護眼學堂");
    assert.equal(p.url, "https://www.eyesinfo.org/t/t-cataract");
    assert.doesNotMatch(`${p.title}${p.text}`, /根治|保證|whatsapp/i);
  });
});
