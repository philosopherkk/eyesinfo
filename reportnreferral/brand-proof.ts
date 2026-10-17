import { asRawPaste, logSafe, redact, screen } from "./src/pii.js";

const pasted = asRawPaste("dummy");
const safe = redact(pasted, screen(pasted));
logSafe(safe);
