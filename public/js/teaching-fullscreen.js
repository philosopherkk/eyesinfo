/**
 * Fullscreen for surgery teaching chrome (viewer + stage text + timeline).
 * Prefer wrapping those panels — not canvas-only requestFullscreen.
 *
 * Esc exits via the browser Fullscreen API. Callers supply enter/exit controls.
 */
export function bindTeachingFullscreen({
  target,
  enterButton,
  exitButton,
  onChange,
}) {
  if (!(target instanceof Element)) {
    throw new Error("bindTeachingFullscreen: target must be an Element");
  }

  const doc = target.ownerDocument;

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

  async function enter() {
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

  async function exit() {
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
    return fsElement() === target;
  }

  function sync() {
    const on = active();
    target.classList.toggle("is-fullscreen", on);
    if (enterButton) {
      enterButton.setAttribute("aria-pressed", on ? "true" : "false");
      enterButton.hidden = on;
    }
    if (exitButton) {
      exitButton.hidden = !on;
    }
    onChange?.(on);
  }

  if (!canEnter) {
    if (enterButton) enterButton.hidden = true;
    if (exitButton) exitButton.hidden = true;
    return { enter, exit, sync, supported: false };
  }

  enterButton?.addEventListener("click", () => {
    void enter().catch(() => {
      /* User gesture / policy rejection — leave chrome unchanged. */
    });
  });
  exitButton?.addEventListener("click", () => {
    void exit().catch(() => {});
  });

  doc.addEventListener("fullscreenchange", sync);
  doc.addEventListener("webkitfullscreenchange", sync);
  sync();

  return { enter, exit, sync, supported: true };
}
