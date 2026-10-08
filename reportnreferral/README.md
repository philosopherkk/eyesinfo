# ReportNReferral

A drafting aid for Hong Kong ophthalmologists. Paste clinical notes once, then generate either:

1. **Patient report**: a plain-language summary a Hong Kong patient can understand, in **Traditional Chinese** (HK usage) or **English**.
2. **Hospital Authority referral**: an **English** referral letter to HA ophthalmology, with a **tone slider** from 1 (Concise) to 5 (Angelic).

Personal information is screened before anything can be generated.

## Run it

```bash
npm run reportnreferral     # http://127.0.0.1:5174/reportnreferral/  (local static server)
npm test                    # includes reportnreferral/test/*.test.mjs
node scripts/sync-reportnreferral.mjs   # refresh public/reportnreferral/
```

It is plain static HTML, CSS and ES modules (no build step), so any static host works. Browsers block ES modules
from `file://`, so use the small server above or any static server.

## How it works

| Step          | What happens                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Paste      | Notes go into a text box. `src/pii.js` screens them as you type.                                                                                                                      |
| 2. Understood | `src/extract.js` finds visual acuity, IOP, conditions (with eye, suspected, or ruled out), tests, treatments, drug classes, follow-up interval, age and sex. Every field is editable. |
| 3. Generate   | `src/report.js` or `src/referral.js` builds the document from the structured data and the glossary in `src/glossary.js`.                                                              |
| 4. Review     | The output is editable. Copy, print or save as PDF, or download `.txt`.                                                                                                               |

### Personal-information screening

Generation is **blocked** while any identifier remains in any text box (notes, specific question, patient
circumstances). Each finding can be located, removed, or marked "Not personal"; "Remove all automatically"
replaces everything with `[removed: ...]` placeholders.

Detected: patient and clinician names (labels, honorifics, romanised and Chinese names), HKID, hospital and case
numbers, phone, email, links, messaging IDs, addresses (English and Chinese), dates including date of birth, and
age 90 or over. Heuristic matches are labelled "possible".

This is a best-effort safety net, not a guarantee. The doctor remains responsible for what is pasted. The generated
text is re-checked when copied, printed or downloaded.

The documents contain placeholders (`[name / HKID / ...]`, `[referring doctor ...]`) so identifiers are added in your
own record system, never in this tool.

### Tone (referral only)

Tone changes courtesy, urgency and closing wording. It never changes the clinical facts, the urgency category or the
requested action. The priority is a separate control; a suggestion is shown from the recognised conditions, and the
doctor decides.

## Privacy by design

- No network calls: the page ships a Content-Security-Policy with `connect-src 'none'`.
- No cookies, `localStorage`, analytics or service worker. Refreshing the tab clears everything.
- Extraction and generation are deterministic and rule-based (no AI service), so clinical text never leaves the browser.

## Content rules

- Drug classes and INN only, no brand names. Patient reports never echo free text from the notes, so brand names
  typed in notes do not reach the patient document.
- Patient reports keep the emergency advice (A&E the same day; call 999 if unable to travel) and a line that the
  summary does not replace a discussion with the registered doctor.
- Literature or prognosis numbers are never generated.
- Visual-acuity and eye-pressure explanations are generic; they are not prognosis.

## Scope and limitations

- Free-text parsing is rule-based. Unusual shorthand may be missed, which is why step 2 shows what was understood
  and lets you correct it. Conditions outside `src/glossary.js` are left out of the patient report (but the
  referral letter can still include the screened notes verbatim).
- Chinese patient text was written for Hong Kong readers and should be read by a clinician before wider use.
- This is **not** a medical device and gives no diagnosis. A registered doctor must review every document.

## Live host

**Public URL:** https://philosopherkk.github.io/reportnreferral/

This folder is the development / test source in the eyesinfo repo. The GitHub Pages hub
(`philosopherkk/philosopherkk.github.io`) is the public host. After editing here, refresh the
hub publish bundle and apply it:

```bash
node scripts/bundle-reportnreferral-for-hub.mjs   # if present
# or copy shippable files into docs/hub-publish/reportnreferral/app/
bash docs/hub-publish/reportnreferral/apply-to-github-io.sh /path/to/philosopherkk.github.io
```

Do **not** serve this tool from eyesinfo.org (education site; no 轉介 shopfront).

## Extending

- Add conditions, tests, treatments or drug classes in `src/glossary.js` (English and Traditional Chinese together).
- Adjust tone wording in `src/referral.js` (`OPENING`, `URGENCY_LINE`, `CLOSING`).
- Add detectors in `src/pii.js` (`DETECTORS`) with a matching case in `test/pii.test.mjs`.
