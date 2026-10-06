/**
 * Mobile page-scroll policy for Three.js OrbitControls (educational iframes).
 *
 * - One finger: do not orbit — browser may scroll the page (touch-action: pan-y).
 * - Two fingers: rotate + dolly (pinch).
 * - Mouse / trackpad on desktop: unchanged (left-drag orbit, wheel zoom).
 *
 * Uses a non-matching `touches.ONE` value so OrbitControls leaves state NONE
 * (three@0.170 / 0.180 TOUCH has no NONE). Also releases pointer capture on
 * lone touches so setPointerCapture does not trap the scroll gesture.
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
        } catch {
          /* already released */
        }
      }
    });
  });

  domElement.addEventListener("pointerup", forget);
  domElement.addEventListener("pointercancel", forget);
}
