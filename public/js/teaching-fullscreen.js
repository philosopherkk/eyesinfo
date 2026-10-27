/**
 * Fullscreen for surgery teaching chrome (viewer + stage text + timeline).
 * Prefer wrapping those panels — not canvas-only requestFullscreen.
 *
 * Esc exits via the browser Fullscreen API. Callers supply enter/exit controls.
 * Optional parkElements move into the exit bar while fullscreen so controls that
 * normally live outside #teachingChrome (e.g. procedure select) stay available.
 *
 * When a procedure swap must navigate/remount the document, callers mark a
 * persist intent first; the next page restores native fullscreen when allowed,
 * otherwise a CSS fixed-cover fallback so FS is preserved from the user's POV.
 */

export const TEACHING_FS_PERSIST_KEY = "eyesinfo-teaching-fs-persist";

export function markTeachingFullscreenPersist() {
  try {
    sessionStorage.setItem(TEACHING_FS_PERSIST_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
}

export function clearTeachingFullscreenPersist() {
  try {
    sessionStorage.removeItem(TEACHING_FS_PERSIST_KEY);
  } catch {
    /* ignore */
  }
}

export function shouldRestoreTeachingFullscreen() {
  try {
    return sessionStorage.getItem(TEACHING_FS_PERSIST_KEY) === "1";
  } catch {
    return false;
  }
}

/** True when this document's fullscreen element is the teaching chrome target. */
export function isTeachingFullscreenElement(target, doc = target?.ownerDocument) {
  if (!(target instanceof Element) || !doc) return false;
  const active =
    doc.fullscreenElement ||
    /** @type {Document & { webkitFullscreenElement?: Element | null }} */ (doc)
      .webkitFullscreenElement ||
    null;
  return active === target;
}

/**
 * Set #procedure from ?procedure= before deferred module work paints the
 * HTML default (cataract). Safe to call from an inline classic script.
 */
export function applyProcedureSelectFromQuery(select, search = location.search) {
  if (!(select instanceof HTMLSelectElement) && !(select && select.options)) {
    return false;
  }
  let id = "";
  try {
    id = new URLSearchParams(search).get("procedure") || "";
  } catch {
    return false;
  }
  if (!id) return false;
  const options = select.options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === id) {
      select.value = id;
      return true;
    }
  }
  return false;
}

export function bindTeachingFullscreen({
  target,
  enterButton,
  exitButton,
  parkElements = [],
  onChange,
  restorePersist = true,
}) {
  if (!(target instanceof Element)) {
    throw new Error("bindTeachingFullscreen: target must be an Element");
  }

  const doc = target.ownerDocument;
  const parks = (Array.isArray(parkElements) ? parkElements : [])
    .filter((el) => el instanceof Element)
    .map((el) => ({
      el,
      parent: el.parentNode,
      next: el.nextSibling,
    }));

  /** CSS fixed-cover fallback when native restore is blocked after navigation. */
  let cssFallback = false;

  const fsElement = () =>
    doc.fullscreenElement ||
    /** @type {Document & { webkitFullscreenElement?: Element | null }} */ (doc)
      .webkitFullscreenElement ||
    null;

  const canEnter =
    typeof target.requestFullscreen === "function" ||
    typeof /** @type {Element & { webkitRequestFullscreen?: () => void }} */ (
      target
    ).webkitRequestFullscreen === "function";

  async function enterNative() {
    if (typeof target.requestFullscreen === "function") {
      await target.requestFullscreen();
      return;
    }
    const webkit = /** @type {Element & { webkitRequestFullscreen?: () => void }} */ (
      target
    );
    if (typeof webkit.webkitRequestFullscreen === "function") {
      webkit.webkitRequestFullscreen();
    }
  }

  async function exitNative() {
    if (typeof doc.exitFullscreen === "function" && doc.fullscreenElement) {
      await doc.exitFullscreen();
      return;
    }
    const webkitDoc = /** @type {Document & { webkitExitFullscreen?: () => void; webkitFullscreenElement?: Element | null }} */ (
      doc
    );
    if (
      typeof webkitDoc.webkitExitFullscreen === "function" &&
      webkitDoc.webkitFullscreenElement
    ) {
      webkitDoc.webkitExitFullscreen();
    }
  }

  function active() {
    return fsElement() === target || cssFallback;
  }

  function applyPark(on) {
    if (!exitButton || parks.length === 0) return;
    const bar = exitButton.parentElement;
    if (!bar) return;

    if (on) {
      for (const { el } of parks) {
        if (el.parentElement !== bar) {
          bar.insertBefore(el, exitButton);
        }
      }
      return;
    }

    for (const { el, parent, next } of parks) {
      if (!parent) continue;
      if (el.parentNode === parent && el.nextSibling === next) continue;
      parent.insertBefore(el, next);
    }
  }

  function sync() {
    const on = active();
    target.classList.toggle("is-fullscreen", on);
    target.classList.toggle("is-fullscreen-css", cssFallback);
    applyPark(on);
    if (enterButton) {
      enterButton.setAttribute("aria-pressed", on ? "true" : "false");
      enterButton.hidden = on;
    }
    if (exitButton) {
      exitButton.hidden = !on;
    }
    onChange?.(on);
  }

  async function enter() {
    cssFallback = false;
    try {
      await enterNative();
    } catch {
      /* User gesture / policy rejection — fall through to CSS cover. */
    }
    if (fsElement() !== target) {
      cssFallback = true;
    }
    sync();
  }

  async function exit() {
    clearTeachingFullscreenPersist();
    cssFallback = false;
    try {
      await exitNative();
    } catch {
      /* ignore */
    }
    sync();
  }

  /**
   * After a remount that tore down native FS, re-enter when a persist intent
   * was marked. Prefer native; otherwise CSS fixed cover.
   */
  async function restorePersistedFullscreen() {
    if (!restorePersist || !shouldRestoreTeachingFullscreen()) {
      return false;
    }
    clearTeachingFullscreenPersist();
    cssFallback = false;
    try {
      await enterNative();
    } catch {
      /* expected without sticky user activation after navigation */
    }
    if (fsElement() !== target) {
      cssFallback = true;
    }
    sync();
    return active();
  }

  if (!canEnter) {
    if (enterButton) enterButton.hidden = true;
    if (exitButton) exitButton.hidden = true;
    void restorePersistedFullscreen();
    return {
      enter,
      exit,
      sync,
      active,
      restorePersistedFullscreen,
      supported: false,
    };
  }

  enterButton?.addEventListener("click", () => {
    void enter().catch(() => {
      /* leave chrome unchanged */
    });
  });
  exitButton?.addEventListener("click", () => {
    void exit().catch(() => {});
  });

  doc.addEventListener("fullscreenchange", () => {
    if (fsElement() === target) {
      cssFallback = false;
    }
    // Native Esc exit: drop persist so a later remount does not re-enter.
    if (!fsElement() && !cssFallback) {
      clearTeachingFullscreenPersist();
    }
    sync();
  });
  doc.addEventListener("webkitfullscreenchange", () => {
    if (fsElement() === target) {
      cssFallback = false;
    }
    if (!fsElement() && !cssFallback) {
      clearTeachingFullscreenPersist();
    }
    sync();
  });
  sync();
  void restorePersistedFullscreen();

  return {
    enter,
    exit,
    sync,
    active,
    restorePersistedFullscreen,
    supported: true,
  };
}
