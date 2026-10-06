/**
 * Mobile page-scroll policy for Three.js OrbitControls (educational iframes).
 *
 * - One finger: do not orbit — browser may scroll the page (touch-action: pan-y).
 * - Two fingers: rotate + dolly (pinch). Multi-touch gestures are kept on the
 *   canvas (non-passive preventDefault) so a vertical two-finger drag tilts the
 *   model instead of being taken over as a page pan.
 * - Mouse / trackpad on desktop: unchanged (left-drag orbit, wheel zoom).
 *
 * Uses a non-matching `touches.ONE` value so OrbitControls leaves state NONE
 * (three@0.170 / 0.180 TOUCH has no NONE). Also releases pointer capture on
 * lone touches so setPointerCapture does not trap the scroll gesture. Because
 * a released touch can end over another element (a label, or off the canvas),
 * a one-time window listener forwards that end as a `pointercancel` on the
 * canvas, so OrbitControls and page tap handlers never keep a stale pointer.
 *
 * Import from pages that already expose `three` via import map.
 */
import { TOUCH } from "three";

/** Not ROTATE / PAN / DOLLY_* — OrbitControls treats this as no one-finger action. */
const TOUCH_NONE = -1;

/**
 * @param {import("three/addons/controls/OrbitControls.js").OrbitControls} controls
 * @param {HTMLElement} domElement
 */
export function enablePageScrollOrbit(controls, domElement) {
  controls.touches.ONE = TOUCH_NONE;
  controls.touches.TWO = TOUCH.DOLLY_ROTATE;

  domElement.style.touchAction = "pan-y";

  const touchIds = new Set();

  const forget = (event) => {
    if (event.pointerType !== "touch") return;
    touchIds.delete(event.pointerId);
  };

  /** Make sure a released touch always ends on the canvas as well. */
  const watchReleasedTouch = (pointerId) => {
    const onEnd = (event) => {
      if (event.pointerId !== pointerId) return;
      window.removeEventListener("pointerup", onEnd, true);
      window.removeEventListener("pointercancel", onEnd, true);
      // The canvas receives (or already received) this event itself.
      if (event.target === domElement) return;
      touchIds.delete(pointerId);
      let synthetic;
      try {
        synthetic = new PointerEvent("pointercancel", {
          pointerId,
          pointerType: "touch",
          isPrimary: event.isPrimary,
          clientX: event.clientX,
          clientY: event.clientY,
          bubbles: true,
        });
      } catch {
        return;
      }
      domElement.dispatchEvent(synthetic);
    };
    window.addEventListener("pointerup", onEnd, true);
    window.addEventListener("pointercancel", onEnd, true);
  };

  domElement.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    touchIds.add(event.pointerId);
    // After OrbitControls' bubble listener has setPointerCapture.
    queueMicrotask(() => {
      if (touchIds.size !== 1) return;
      if (
        typeof domElement.hasPointerCapture === "function" &&
        domElement.hasPointerCapture(event.pointerId)
      ) {
        try {
          domElement.releasePointerCapture(event.pointerId);
          watchReleasedTouch(event.pointerId);
        } catch {
          /* already released */
        }
      }
    });
  });

  domElement.addEventListener("pointerup", forget);
  domElement.addEventListener("pointercancel", forget);

  // Two or more fingers on the canvas: keep the gesture for rotate / pinch.
  const keepMultiTouch = (event) => {
    if (event.touches && event.touches.length >= 2 && event.cancelable) {
      event.preventDefault();
    }
  };
  domElement.addEventListener("touchstart", keepMultiTouch, { passive: false });
  domElement.addEventListener("touchmove", keepMultiTouch, { passive: false });
}
