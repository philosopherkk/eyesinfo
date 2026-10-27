import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const LASER_IDS = ["mlt", "lpi", "yag", "retinopexy", "elt"];

/** Minimal DOM stub so parkElements can be exercised without jsdom. */
function makeParkHarness() {
  class FakeElement {}
  globalThis.Element = FakeElement;

  const listeners = new Map();
  const doc = {
    fullscreenElement: null,
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    dispatch(type) {
      for (const fn of listeners.get(type) || []) fn();
    },
  };

  function el(tag, id) {
    const node = new FakeElement();
    Object.assign(node, {
      tagName: tag.toUpperCase(),
      id,
      ownerDocument: doc,
      parentNode: null,
      parentElement: null,
      nextSibling: null,
      children: [],
      hidden: false,
      classList: { toggle() {} },
      setAttribute() {},
      requestFullscreen: async () => {
        doc.fullscreenElement = node;
        doc.dispatch("fullscreenchange");
      },
      insertBefore(child, before) {
        if (child.parentNode) {
          const sibs = child.parentNode.children;
          const idx = sibs.indexOf(child);
          if (idx >= 0) sibs.splice(idx, 1);
          child.parentNode = null;
          child.parentElement = null;
        }
        const at = before ? node.children.indexOf(before) : node.children.length;
        node.children.splice(at < 0 ? node.children.length : at, 0, child);
        child.parentNode = node;
        child.parentElement = node;
        for (let j = 0; j < node.children.length; j++) {
          node.children[j].nextSibling = node.children[j + 1] || null;
        }
        return child;
      },
      appendChild(child) {
        return node.insertBefore(child, null);
      },
      addEventListener(type, fn) {
        if (!listeners.has(`${id}:${type}`)) listeners.set(`${id}:${type}`, []);
        listeners.get(`${id}:${type}`).push(fn);
      },
      click(type = "click") {
        for (const fn of listeners.get(`${id}:${type}`) || []) fn();
      },
    });
    return node;
  }

  const header = el("div", "header");
  const procedure = el("select", "procedure");
  const language = el("select", "language");
  header.appendChild(procedure);
  header.appendChild(language);

  const chrome = el("main", "teachingChrome");
  const exitBar = el("div", "fs-exit-bar");
  const exitButton = el("button", "exitFullscreen");
  exitBar.appendChild(exitButton);
  chrome.appendChild(exitBar);

  const enterButton = el("button", "enterFullscreen");

  doc.exitFullscreen = async () => {
    doc.fullscreenElement = null;
    doc.dispatch("fullscreenchange");
  };

  return { doc, chrome, header, procedure, language, exitBar, exitButton, enterButton };
}

describe("surgery teaching fullscreen chrome", () => {
  it("ships a shared helper that targets a wrapper, not canvas-only", () => {
    const helper = readFileSync(join(root, "public/js/teaching-fullscreen.js"), "utf8");
    assert.match(helper, /bindTeachingFullscreen/);
    assert.match(helper, /requestFullscreen/);
    assert.match(helper, /viewer \+ stage text \+ timeline/);
    assert.match(helper, /parkElements/);
    assert.match(helper, /applyPark/);
  });

  for (const file of ["public/cataract-phaco.html", "public/procedures-3d.html"]) {
    it(`${file} wires enter/exit controls onto #teachingChrome`, () => {
      const html = readFileSync(join(root, file), "utf8");
      assert.match(html, /id="teachingChrome"/);
      assert.match(html, /id="enterFullscreen"/);
      assert.match(html, /id="exitFullscreen"/);
      assert.match(html, /全螢幕 \/ Fullscreen/);
      assert.match(html, /離開全螢幕 \/ Exit fullscreen/);
      assert.match(html, /teaching-fullscreen\.js/);
      assert.match(html, /bindTeachingFullscreen/);
      assert.match(html, /parkElements:\s*\[\s*\$\("procedure"\)\s*\]/);
      assert.doesNotMatch(html, /canvas\.requestFullscreen/);
    });

    it(`${file} lists all nine procedures including lasers in #procedure`, () => {
      const html = readFileSync(join(root, file), "utf8");
      const match = html.match(
        /<select id="procedure"[\s\S]*?<\/select>/
      );
      assert.ok(match, "procedure select present");
      const select = match[0];
      for (const id of ["cataract", "rrd", "injection", "chalazion", ...LASER_IDS]) {
        assert.match(select, new RegExp(`value="${id}"`));
      }
    });
  }

  it("procedure React embed allows iframe fullscreen", () => {
    const page = readFileSync(join(root, "src/routes/tools.procedures.tsx"), "utf8");
    assert.match(page, /allow="fullscreen"/);
    assert.match(page, /allowFullScreen/);
  });

  it("parks the same procedure select into the exit bar on fullscreen", async () => {
    const helperUrl = pathToFileURL(
      join(root, "public/js/teaching-fullscreen.js")
    ).href;
    const { bindTeachingFullscreen } = await import(helperUrl);
    const h = makeParkHarness();

    bindTeachingFullscreen({
      target: h.chrome,
      enterButton: h.enterButton,
      exitButton: h.exitButton,
      parkElements: [h.procedure],
    });

    assert.equal(h.procedure.parentNode, h.header);
    h.enterButton.click();
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(h.procedure.parentNode, h.exitBar);
    assert.equal(h.exitBar.children[0], h.procedure);
    assert.equal(h.exitBar.children[1], h.exitButton);
    assert.equal(h.language.parentNode, h.header);

    h.exitButton.click();
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(h.procedure.parentNode, h.header);
    assert.equal(h.header.children[0], h.procedure);
    assert.equal(h.header.children[1], h.language);
  });
});


