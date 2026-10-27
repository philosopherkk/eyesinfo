import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it, beforeEach } from "node:test";
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
      classList: {
        _set: new Set(),
        toggle(name, force) {
          if (force === true) this._set.add(name);
          else if (force === false) this._set.delete(name);
          else if (this._set.has(name)) this._set.delete(name);
          else this._set.add(name);
        },
        contains(name) {
          return this._set.has(name);
        },
      },
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

function makeSessionStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
    clear() {
      map.clear();
    },
  };
}

describe("surgery teaching fullscreen chrome", () => {
  beforeEach(() => {
    globalThis.sessionStorage = makeSessionStorage();
  });

  it("ships a shared helper that targets a wrapper, not canvas-only", () => {
    const helper = readFileSync(join(root, "public/js/teaching-fullscreen.js"), "utf8");
    assert.match(helper, /bindTeachingFullscreen/);
    assert.match(helper, /requestFullscreen/);
    assert.match(helper, /viewer \+ stage text \+ timeline/);
    assert.match(helper, /parkElements/);
    assert.match(helper, /applyPark/);
    assert.match(helper, /markTeachingFullscreenPersist/);
    assert.match(helper, /restorePersistedFullscreen|shouldRestoreTeachingFullscreen/);
    assert.match(helper, /is-fullscreen-css/);
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
      assert.match(html, /is-fullscreen-css/);
      assert.match(html, /markTeachingFullscreenPersist|markFsPersist/);
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

    it(`${file} syncs #procedure from ?procedure= before module paint`, () => {
      const html = readFileSync(join(root, file), "utf8");
      assert.match(
        html,
        /URLSearchParams\(location\.search\)\.get\("procedure"\)/
      );
      assert.match(html, /el\.value = id/);
    });
  }

  it("procedure React embed allows iframe fullscreen and keeps bundle src stable", () => {
    const page = readFileSync(join(root, "src/routes/tools.procedures.tsx"), "utf8");
    assert.match(page, /allow="fullscreen"/);
    assert.match(page, /allowFullScreen/);
    assert.match(page, /eyesinfo-select-procedure/);
    assert.match(page, /viewerShellFor|ViewerShell/);
    assert.match(page, /markPersistIfViewerFullscreen/);
    assert.match(page, /TEACHING_FS_PERSIST_KEY/);
    // Bundle↔bundle must postMessage, not rebuild src from every procedure id.
    assert.match(page, /setFrameSrc\(buildViewerSrc/);
    assert.match(page, /shellChanged \|\| langChanged/);
    // Mid-load chip clicks are recorded and flushed on load / viewer-ready.
    assert.match(page, /pendingBundleIdRef/);
    assert.match(page, /flushPendingBundleSelect/);
    assert.match(page, /eyesinfo-procedure-ready/);
    assert.match(page, /onLoad=\{/);
  });

  it("procedures-3d queues parent select messages before activator is ready", () => {
    const html = readFileSync(join(root, "public/procedures-3d.html"), "utf8");
    assert.match(html, /eyesinfo-select-procedure/);
    assert.match(html, /fromParent:\s*true/);
    assert.match(html, /eyesinfo-prepare-procedure-nav/);
    assert.match(html, /parentProcedureBridge/);
    assert.match(html, /eyesinfo-procedure-ready/);
    assert.match(html, /queuedFromParent/);
  });

  it("helper does not clear persist on fullscreenchange (remount-safe)", () => {
    const helper = readFileSync(join(root, "public/js/teaching-fullscreen.js"), "utf8");
    // fullscreenchange must sync only — clearTeachingFullscreenPersist belongs to exit/restore.
    const changeHandler = helper.match(
      /doc\.addEventListener\("fullscreenchange",[\s\S]*?\}\);/
    );
    assert.ok(changeHandler, "fullscreenchange listener present");
    assert.doesNotMatch(
      changeHandler[0],
      /clearTeachingFullscreenPersist/
    );
  });

  it("parks the same procedure select into the exit bar on fullscreen", async () => {
    const helperUrl = pathToFileURL(
      join(root, "public/js/teaching-fullscreen.js")
    ).href;
    const { bindTeachingFullscreen } = await import(`${helperUrl}?park=${Date.now()}`);
    const h = makeParkHarness();

    bindTeachingFullscreen({
      target: h.chrome,
      enterButton: h.enterButton,
      exitButton: h.exitButton,
      parkElements: [h.procedure],
      restorePersist: false,
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

  it("restores fullscreen after persist intent (stays FS across remount)", async () => {
    const helperUrl = pathToFileURL(
      join(root, "public/js/teaching-fullscreen.js")
    ).href;
    const mod = await import(`${helperUrl}?persist=${Date.now()}`);
    const {
      bindTeachingFullscreen,
      markTeachingFullscreenPersist,
      TEACHING_FS_PERSIST_KEY,
    } = mod;

    const first = makeParkHarness();
    const api1 = bindTeachingFullscreen({
      target: first.chrome,
      enterButton: first.enterButton,
      exitButton: first.exitButton,
      parkElements: [first.procedure],
      restorePersist: false,
    });

    first.enterButton.click();
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(api1.active(), true);
    markTeachingFullscreenPersist();
    assert.equal(sessionStorage.getItem(TEACHING_FS_PERSIST_KEY), "1");

    // Remount tears down native FS (fires fullscreenchange) — must NOT clear persist.
    first.doc.fullscreenElement = null;
    first.doc.dispatch("fullscreenchange");
    assert.equal(
      sessionStorage.getItem(TEACHING_FS_PERSIST_KEY),
      "1",
      "persist survives remount-driven fullscreenchange"
    );

    // Simulate document remount: new chrome, persist key still set.
    const second = makeParkHarness();
    let requestCount = 0;
    const originalRequest = second.chrome.requestFullscreen;
    second.chrome.requestFullscreen = async () => {
      requestCount += 1;
      return originalRequest.call(second.chrome);
    };

    const api2 = bindTeachingFullscreen({
      target: second.chrome,
      enterButton: second.enterButton,
      exitButton: second.exitButton,
      parkElements: [second.procedure],
      restorePersist: true,
    });
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(requestCount, 1, "restore attempts native requestFullscreen");
    assert.equal(api2.active(), true, "fullscreen active after restore");
    assert.equal(sessionStorage.getItem(TEACHING_FS_PERSIST_KEY), null);
    assert.equal(second.procedure.parentNode, second.exitBar);
  });

  it("explicit exit clears persist so a later remount does not re-enter", async () => {
    const helperUrl = pathToFileURL(
      join(root, "public/js/teaching-fullscreen.js")
    ).href;
    const {
      bindTeachingFullscreen,
      markTeachingFullscreenPersist,
      TEACHING_FS_PERSIST_KEY,
    } = await import(`${helperUrl}?exitclear=${Date.now()}`);

    const h = makeParkHarness();
    const api = bindTeachingFullscreen({
      target: h.chrome,
      enterButton: h.enterButton,
      exitButton: h.exitButton,
      parkElements: [h.procedure],
      restorePersist: false,
    });
    h.enterButton.click();
    await Promise.resolve();
    await Promise.resolve();
    markTeachingFullscreenPersist();
    h.exitButton.click();
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(api.active(), false);
    assert.equal(sessionStorage.getItem(TEACHING_FS_PERSIST_KEY), null);
  });

  it("falls back to CSS fullscreen when native restore is blocked", async () => {
    const helperUrl = pathToFileURL(
      join(root, "public/js/teaching-fullscreen.js")
    ).href;
    const {
      bindTeachingFullscreen,
      markTeachingFullscreenPersist,
    } = await import(`${helperUrl}?css=${Date.now()}`);

    markTeachingFullscreenPersist();
    const h = makeParkHarness();
    h.chrome.requestFullscreen = async () => {
      throw new Error("NotAllowedError");
    };

    const api = bindTeachingFullscreen({
      target: h.chrome,
      enterButton: h.enterButton,
      exitButton: h.exitButton,
      parkElements: [h.procedure],
      restorePersist: true,
    });
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(api.active(), true);
    assert.equal(h.chrome.classList.contains("is-fullscreen"), true);
    assert.equal(h.chrome.classList.contains("is-fullscreen-css"), true);
    assert.equal(h.procedure.parentNode, h.exitBar);
  });

  it("applyProcedureSelectFromQuery keeps non-cataract value (no flash)", async () => {
    const helperUrl = pathToFileURL(
      join(root, "public/js/teaching-fullscreen.js")
    ).href;
    const { applyProcedureSelectFromQuery } = await import(
      `${helperUrl}?select=${Date.now()}`
    );

    class FakeElement {}
    globalThis.Element = FakeElement;
    globalThis.HTMLSelectElement = FakeElement;

    const options = [
      { value: "cataract" },
      { value: "mlt" },
      { value: "lpi" },
    ];
    const select = {
      options,
      value: "cataract",
    };
    Object.setPrototypeOf(select, FakeElement.prototype);

    const ok = applyProcedureSelectFromQuery(select, "?procedure=mlt&lang=zh");
    assert.equal(ok, true);
    assert.equal(select.value, "mlt");
  });
});
