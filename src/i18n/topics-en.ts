import type { Block } from "@/data/topics";

export type TopicPack = { title: string; tag: string; meta: string; blocks: Block[] };

const w = (text: string): Block => ({ type: "warn", text });
const h = (text: string): Block => ({ type: "h", text });
const p = (text: string): Block => ({ type: "p", text });
const ul = (items: string[]): Block => ({ type: "ul", items });
const ol = (items: string[]): Block => ({ type: "ol", items });

export const EN_PACKS: Record<string, TopicPack> = {
  d1: {
    title: "Refractive error",
    tag: "Most common",
    meta: "Myopia · hyperopia · astigmatism · presbyopia",
    blocks: [
      h("What it is"),
      p("Light does not focus on the retina. Myopia blurs distance; hyperopia makes near work effortful; astigmatism distorts. Presbyopia is loss of lens focusing with age — strictly a decline in accommodation, not a classic refractive error, grouped here because the optical approaches overlap. In Hong Kong, 100 degrees = 1.00 D; high myopia is usually ≥ 600 degrees (−6.00 D). Myopia is often axial. About 1 mm of extra axial length is roughly 2.5–3.00 D. Myopia is common in local schoolchildren."),
      h("Long-term risks of high myopia (≥ 600 degrees)"),
      ul(["Retinal tear or detachment", "Myopic maculopathy", "Glaucoma and early cataract"]),
      h("What a doctor may discuss"),
      ul(["Spectacles or contact lenses after refraction; high myopia needs regular dilated fundus exams by an ophthalmologist", "Myopia-control options for children are discussed on the dedicated page — not a product pitch", "Presbyopia: reading glasses, progressive lenses, or, after cataract assessment, lens options"]),
    ],
  },
  d2: {
    title: "Dry eye",
    tag: "Very common",
    meta: "Tear film · meibomian glands",
    blocks: [
      h("What it is"),
      p("The tear film (oil, water, mucus) is unstable or insufficient. Evaporative dry eye from meibomian gland dysfunction is common in Hong Kong. It can coexist with blepharitis and Demodex."),
      h("Symptoms / when to seek care"),
      ul(["Grit, burning, fluctuating blur, tearing that is still “dry eye”", "Pain, light sensitivity, sudden vision drop: same-day or emergency assessment"]),
      h("What a doctor may discuss"),
      ul(["Warm compress and lid hygiene (see the dedicated pages)", "Lubricating drops; anti-inflammatory drops only on prescription", "Do not self-use steroid drops long term"]),
    ],
  },
  d3: {
    title: "Cataract",
    tag: "Age-related",
    meta: "Lens opacity",
    blocks: [
      h("What it is"),
      p("The lens clouds with age, steroids, trauma or diabetes. It is not a film on the surface that can be peeled off with drops."),
      h("Symptoms / when it is urgent"),
      ul(["Slow blur, glare from oncoming lights, faded colour", "Sudden pain, nausea and a steamy cornea: consider acute angle closure — go to A&E"]),
      h("What a doctor may discuss"),
      ul(["Surgery when daily life or driving is affected — not waiting until the cataract is “ripe”", "Phacoemulsification and an intraocular lens; type of lens is individual", "Literature complication rates, not a clinic success rate"]),
    ],
  },
  d4: {
    title: "Glaucoma",
    tag: "May have no early warning",
    meta: "Optic nerve · intraocular pressure",
    blocks: [
      h("What it is"),
      p("A group of optic neuropathies. Field loss is often unnoticed until late. Lost field does not return. Remaining central acuity can still be good."),
      h("Symptoms / emergency"),
      ul(["Most chronic glaucoma has no pain", "Acute angle closure: severe pain, vomiting, coloured haloes, steamy cornea — A&E now"]),
      h("What a doctor may discuss"),
      ul(["Target pressure, drops, laser or surgery — classes of options, not brand names", "OCT and visual field for monitoring", "The tunnel demo is an illustration, not your field report"]),
    ],
  },
  d5: {
    title: "Age-related macular degeneration",
    tag: "Central vision",
    meta: "Often called 老年黃斑病變 in Hong Kong",
    blocks: [
      h("What it is"),
      p("The macula serves fine central vision. Dry AMD is more common (drusen, geographic atrophy). Wet AMD is driven by choroidal neovascular leakage and can steal vision quickly. Polypoidal choroidal vasculopathy is not rare in Chinese patients. VEGF is one important pathway."),
      h("Symptoms"),
      ul(["Straight lines look bent (metamorphopsia), a central dark patch, washed-out colour", "Trouble recognising faces, reading, or traffic lights"]),
      h("Care a doctor may discuss"),
      ul(["Stop smoking; blood pressure and lipids. AREDS2-type nutrient formulas are mainly discussed for people who already have intermediate AMD — not as prevention for every healthy eye, and not a substitute for stopping smoking. Whether to use them is a doctor’s decision, not an advert.", "Amsler grid for self-checks. New distortion or a central patch needs a prompt dilated exam.", "Wet AMD: an ophthalmologist may consider intravitreal anti-VEGF injections according to Hong Kong-registered indications. Recovery of lost vision is not guaranteed.", "Injection number and interval vary; OCT follow-up is usual."]),
      p("Nutrition reference: AREDS2 Research Group, JAMA 2013. No product names on this page."),
    ],
  },
  d6: {
    title: "Diabetic retinopathy",
    tag: "Needs regular checks",
    meta: "Often called 糖尿上眼 in Hong Kong",
    blocks: [
      h("What it is"),
      p("Long-term high blood sugar damages retinal capillaries: leakage, macular oedema, ischaemia and new vessels, which can bleed or pull the retina off. Early disease can be silent. This is an ocular complication of endocrine disease and needs a registered doctor coordinating medical and eye care."),
      h("What a doctor may discuss"),
      ul(["Medical control of sugar, blood pressure and lipids", "Dilated fundus exams at intervals the ophthalmologist sets — not a fixed “see you next year on this date” for every person", "Intravitreal anti-VEGF, laser or surgery as classes of options when indicated"]),
    ],
  },
  d7: {
    title: "Conjunctivitis",
    tag: "Red eye",
    meta: "Infection · allergy · irritation",
    blocks: [
      h("What it is"),
      p("Inflammation of the conjunctiva. Causes include virus, bacteria, allergy and irritants. Not every red eye is “pink eye” that you treat with leftover drops."),
      h("When it is urgent"),
      ul(["Pain, light sensitivity, reduced vision, contact-lens wear, chemical injury, shingles rash"]),
      h("What a doctor may discuss"),
      ul(["Hygiene, cool compresses, allergy strategies", "Prescription drops if needed — never long-term steroid drops on your own"]),
    ],
  },
  d8: {
    title: "Floaters and retinal detachment risk",
    tag: "Do not ignore flashes",
    meta: "Vitreous ageing",
    blocks: [
      h("What it is"),
      p("The vitreous liquefies and collagen clumps cast shadows (floaters). Most are posterior vitreous detachment. A few warn of a retinal tear or bleed. High myopia (≥ 600 degrees) can bring this on in the 20s–30s, with higher tear/detachment risk."),
      h("Often benign — still needs a doctor to confirm"),
      ul(["A few stable specks or threads for years", "They drift with the eye; no field cut", "No flashes; vision unchanged", "A dilated exam has already ruled out a tear"]),
      h("Same-day dilated exam (no need to call 999 first)"),
      ul(["A sudden shower of new specks", "Frequent flashes, especially in the dark"]),
      h("Go to A&E now (curtain or sudden vision loss)"),
      ul(["A curtain or shadow over the field", "Any sudden sharp drop in vision"]),
      h("What a doctor may discuss"),
      ul(["New or suddenly more floaters need a same-day dilated exam; do not self-diagnose. A curtain or sudden loss of vision is A&E, not 999-first for isolated flashes.", "Most benign floaters are observed; the brain may notice them less over months.", "YAG vitreolysis is not routine.", "Vitrectomy can clear floaters but speeds cataract and has detachment risk — only if life is badly affected and a doctor agrees it is appropriate.", "Tear risk depends on type: a symptomatic horseshoe tear with traction is high risk; asymptomatic atrophic or operculated holes are lower. Laser is decided after dilation, not by a single percentage."]),
    ],
  },
  d9: {
    title: "Blepharitis, stye and chalazion",
    tag: "Eyelid problems",
    meta: "Blocked oil glands and infection",
    blocks: [
      h("What it is"),
      p("Blepharitis is chronic lash-line inflammation, often with meibomian dysfunction, Demodex or seborrhoea. A stye is an acute painful infection. A chalazion is a blocked meibomian granuloma, usually less painful. Incision is considered only if home care fails, and only after a doctor decides."),
      h("What a doctor may discuss"),
      ul(["Warm compress 5–10 minutes, then massage and lid cleaning — do not squeeze", "A stye may need prescribed antibiotics. Repeated attacks: refraction or medical tests are considered by risk, not automatically every time", "Chalazion incision is usually from the conjunctival side. Recurrence in the literature is about 10–20%", "Atypical, non-resolving or recurrent lumps with lash loss, ulcer or thickening — especially in older patients — may need pathology; not every recurrent chalazion is automatically sent"]),
    ],
  },
  d10: {
    title: "Pterygium",
    tag: "Sun and wind",
    meta: "A wing of tissue on the conjunctiva",
    blocks: [
      h("What it is"),
      p("A fibrovascular growth onto the cornea, linked to UV. Hats and sunglasses are lifestyle measures, not a shop."),
      h("What a doctor may discuss"),
      ul(["Lubricants for irritation", "Surgery if it threatens the visual axis, induces astigmatism, or keeps inflaming", "It can come back; this page does not quote success rates"]),
    ],
  },
  "t-allergy": {
    title: "Allergic conjunctivitis — principles",
    tag: "Ocular surface",
    meta: "Itch · seasonal or perennial",
    blocks: [
      h("What it is"),
      p("Allergic inflammation of the ocular surface. Mild seasonal itch is common; severe vernal or atopic disease can scar the cornea."),
      w("Severe allergy or corneal involvement must be assessed by an ophthalmologist."),
      h("What a doctor may discuss"),
      ul(["Avoid rubbing; cool compresses; prescribed antihistamine/mast-cell drops", "Short courses of topical steroid if needed — not for self-long-term use", "Ciclosporin drops or eyelid tacrolimus (off-label) only on a doctor’s advice", "Do not buy prescription drops yourself"]),
    ],
  },
  "t-vegf": {
    title: "Intravitreal anti-VEGF injection",
    tag: "Doctor’s decision",
    meta: "Often called 打眼底針 in Hong Kong",
    blocks: [
      p("Anti-VEGF medicine is given into the vitreous for some macular neovascular or oedematous diseases. Whether it is suitable, which Hong Kong-registered product, how often and at what interval, is decided by an ophthalmologist after examination and OCT. This page does not sell or promote any injection and cannot promise better vision."),
      h("Drug class discussed in Hong Kong"),
      p("An ophthalmologist may choose an anti-VEGF injection according to registered indications. Products differ in indication, interval and public/private supply. Product names are not listed here so this is not a medicine advertisement. Overseas approval does not mean Hong Kong registration."),
      h("Outline of the procedure (for consent education)"),
      ul(["Clean the lids; topical anaesthetic", "Lid speculum; dilute iodine on the conjunctiva", "Pars plana entry distance is decided by the doctor according to phakic or pseudophakic status; often about 3.5–4 mm", "Pressure is checked afterwards; follow the review plan"]),
      h("Risks in the literature (published ranges, not any clinic’s statistics)"),
      ul(["Endophthalmitis: about 0.02–0.05% per injection in the literature — an emergency", "A short rise in eye pressure", "Subconjunctival haemorrhage is common and usually fades in 1–2 weeks", "Retinal detachment is uncommon"]),
      w("After injection, worse pain, worse redness, a sudden vision drop, a shower of floaters or a curtain: go to A&E. Do not wait for a routine clinic slot."),
    ],
  },
  "t-chalazion": {
    title: "Incision and curettage of a chalazion",
    tag: "Consent summary",
    meta: "Conjunctival-side incision",
    blocks: [
      p("If a doctor recommends incision, consent may cover the steps below. Not everyone needs surgery."),
      ul(["Local anaesthetic in the lid", "Clamp; evert the lid; vertical cut on the conjunctival side to reduce skin scar", "Curette the contents; pressure; ointment ± pad"]),
      p("Use ointment as directed. Mild swelling for a day or two is common. Avoid rubbing, swimming and eye make-up for about a week. Restart warm compress only after healing."),
      w("A recurrent or atypical lump with ulcer, lash loss or thickening — especially in older people — may need pathology. Not every recurrence is automatically sent."),
    ],
  },
  "t-myopia": {
    title: "Childhood myopia: options a doctor may discuss",
    tag: "Children and teens",
    meta: "Outdoors · atropine · optical defocus",
    blocks: [
      p("This summarises published research and classes of options often discussed in Hong Kong. It is not a pitch to buy drops, lenses or devices, and it cannot promise slower progression. Any medicine needs a prescription. Orthokeratology and contact lenses must be fitted by a qualified person."),
      h("Outdoor time (public-health measure)"),
      p("About two hours a day of natural light. Intensity matters (literature often cites around 10,000 lux), not indoor sport as such."),
      h("Low-concentration atropine (prescription)"),
      p("A muscarinic antagonist. Concentration, use and stopping must be a doctor’s decision. Do not dilute or buy unofficial preparations. The CUHK LAMP study compared 0.05%, 0.025%, 0.01% and placebo. It is important local literature, not a personal prescription."),
      {
        type: "table",
        rows: [
          ["LAMP year-1 mean change (literature), not a prediction for one child", "Spherical equivalent", "Axial length", "Approx. reduction vs placebo"],
          ["0.05%", "−0.27 D", "+0.20 mm", "SE ~67% / AL ~51%"],
          ["0.025%", "−0.46 D", "+0.29 mm", "SE ~43% / AL ~29%"],
          ["0.01%", "−0.59 D", "+0.36 mm", "SE ~27% / AL ~12%"],
          ["Placebo", "−0.81 D", "+0.41 mm", "—"],
        ],
      },
      p("Possible effects include light sensitivity, mild near blur, rebound after stopping (more at higher concentration). LAMP years 2–5 are reported separately; this table is year 1 only. Rebound can occur. Continuing is a doctor’s decision. This is not a ranking of which concentration is “best”."),
      h("Optical defocus methods"),
      ul(["Orthokeratology: overnight rigid lenses. Infectious keratitis risk (including Acanthamoeba). Hygiene is strict; not for everyone.", "Defocus spectacles or daily myopia-control contacts need enough wearing time.", "Repeated low-level red-light devices: long-term macular safety is debated. Do not buy a home machine on your own."]),
      w("Myopia control does not remove existing fundus risk. Highly myopic children still need regular dilated exams. New flashes or many new floaters: same-day dilation (no need to call 999 first). A curtain or sudden vision loss: A&E."),
      p("Key paper: Yam JC et al. LAMP year 1, Ophthalmology 2019. Later years reported separately."),
    ],
  },
  "t-cataract": {
    title: "Phacoemulsification and intraocular lenses",
    tag: "Consent summary",
    meta: "Cataract surgery as a class of care",
    blocks: [
      h("When it is worth discussing surgery"),
      ul(["Reading, driving or TV limited by blur or glare", "Oncoming headlights at night affecting driving safety", "High hyperopia with a narrow angle", "Cataract blocking monitoring of diabetic retinopathy or macular disease"]),
      h("If phacoemulsification is done — outline"),
      ul(["Usually topical anaesthesia; the person is awake; time depends on nucleus hardness", "About a 2–2.4 mm limbal incision, often no suture", "Ultrasound removes the cloudy nucleus; the bag is kept", "A foldable lens is placed in the bag"]),
      h("Optical classes of lens (not a brand pitch)"),
      {
        type: "table",
        rows: [
          ["Type", "Typical features (individual)"],
          ["Monofocal", "Clearest at the targeted distance (far, intermediate or near). Other distances usually need glasses. Glare relatively less."],
          ["Enhanced monofocal", "Slightly longer depth of focus. Night optical effects vary by product and pupil; generally less than diffractive multifocals, not a promise of “few halos”."],
          ["Toric", "Corrects regular corneal astigmatism; must sit at the right axis."],
          ["EDOF", "More continuous far-to-intermediate; fine print may still need glasses."],
          ["Multifocal / trifocal", "Tries far, intermediate and near. More glare/halos. Usually unsuitable if there is macular disease or a significant field defect."],
        ],
      },
      h("Complication figures from the literature (not any clinic’s success rate)"),
      ul([
        "Posterior capsule rupture about 0.5–1.5% (higher with a denser nucleus or complex anatomy)",
        "Clinically significant macular oedema about 1–2%",
        "Endophthalmitis <0.1% — an emergency: redness, sudden drop in vision or discharge means A&E now",
      ]),
      h("Years later: posterior capsule opacification (not a returning cataract)"),
      p("The implant stays in the original bag. Lens epithelial cells can cloud the posterior capsule over years (PCO, sometimes called an after-cataract). Literature: about 10–40%. This is not a new lens growing back, and it is not a failed operation."),
      p("Blur years after cataract surgery is usually PCO, not a “returning cataract”. Not every blur needs YAG capsulotomy. A doctor must judge whether it affects function and exclude macular, corneal or other causes. The laser is outpatient, with no incision. See the YAG fact sheet."),
      w("After YAG, a shower of new floaters, flashes, a curtain or severe pain: go to A&E."),
    ],
  },
  "t-warm": {
    title: "Warm compress and lid massage",
    tag: "Home care",
    meta: "Meibomian dysfunction · blepharitis · chalazion",
    blocks: [
      p("Heat softens stagnant oil; massage then helps it out. This is care advice, not a product sale."),
      ul(["Clean cloth in warm water. Skin contact should be warm, not hot — about 45°C at most. Test on the wrist. Stop if it hurts. Extra care for children, older people or reduced sensation.", "On closed lids 5–10 minutes", "Then massage toward the lash line. Do not press the eyeball or use a fingernail.", "Clean the lash line as advised. Do not put undiluted essential oil on mucosa."]),
    ],
  },
  "t-demodex": {
    title: "Demodex-related blepharitis",
    tag: "Lash mites",
    meta: "Cylindrical dandruff",
    blocks: [
      p("Demodex on lashes can drive chronic blepharitis. Cylindrical dandruff at the lash roots is a clue. Treatment classes a doctor may discuss include lid hygiene and, where appropriate, prescription agents. This page does not name consumer brands as a shopfront."),
    ],
  },
  "t-dry": {
    title: "Dry-eye types and a care ladder",
    tag: "DEWS II education",
    meta: "Evaporative · aqueous-deficient",
    blocks: [
      p("Doctors often follow a stepwise approach: environment and lids first, then lubricants, then prescription anti-inflammatory drops if needed, then procedures. Steroid drops are not for unsupervised long-term use. This is a class of discussion, not a product list."),
    ],
  },
  "t-glaucoma": {
    title: "Glaucoma target pressure and monitoring",
    tag: "Follow-up",
    meta: "IOP · OCT · visual field",
    blocks: [
      p("A target pressure is individual. Drops, laser or surgery are classes of options. Timing of drops follows the product label and the doctor — do not retimethem from this page. Field already lost does not return. The tunnel demo is not your field test."),
    ],
  },
  "t-drops": {
    title: "How to use eye drops",
    tag: "Technique",
    meta: "Punctal occlusion · five minutes apart",
    blocks: [
      ol(["Wash hands. Shake suspensions if needed.", "Tilt the head; pull down the lower lid to make a pocket.", "Hold the bottle 1–2 cm from the eye; do not touch. One drop is enough.", "Close gently 1–2 minutes; do not squeeze-blink.", "Press the inner corner (punctum) 3–5 minutes to cut systemic absorption."]),
      p("Two drops at least five minutes apart. Thin then thick; ointment last. Timing follows the label and the doctor — not a blanket “always at bedtime” or “always in the morning” from this page."),
    ],
  },
  "t-iol": {
    title: "Choosing an intraocular lens — detail",
    tag: "No lens fits everyone",
    meta: "Monofocal · toric · EDOF · multifocal",
    blocks: [
      {
        type: "table",
        rows: [
          ["", "Far", "Intermediate", "Near", "Halos", "Macular disease"],
          ["Monofocal", "Best at the targeted distance", "Depends on target", "Depends on target", "Usually fewer (varies)", "Often still considered"],
          ["Enhanced monofocal", "Good at target", "Often a bit better than standard monofocal", "Usually still needs glasses", "Generally less than diffractive multifocal; not a guarantee", "Often still considered"],
          ["Toric", "Added to any of the above", "As base design", "As base design", "As base design", "As base design"],
          ["EDOF", "Good", "Good", "Fine print often still needs glasses", "Mild to moderate; product-dependent", "Use with caution"],
          ["Multifocal / trifocal", "Good", "Good", "Higher chance of less reading glasses", "More noticeable", "Usually not advised"],
        ],
      },
      p("For regular corneal astigmatism of about ≥0.75–1.00 D a toric lens may be discussed. Brand choice is individual. This page lists no product names."),
    ],
  },
  "t-early": {
    title: "Hyperopia, shallow anterior chamber and the lens",
    tag: "Angle-closure education",
    meta: "Anterior chamber · angle · emergency signs",
    blocks: [
      p("Hyperopic eyes are shorter, with a shallower chamber and narrower angle. The lens thickens with age. Angle-closure glaucoma is more common in Chinese people than in many Western populations. This is not a call for every hyperope to have cataract surgery."),
      w("Acute angle closure: pressure can rise to tens of mmHg — severe pain, vomiting, rainbow haloes, steamy cornea, a mid-dilated fixed pupil. Untreated hours can permanently damage the optic nerve. Go to A&E. Do not put in dilating drops or wait for a private clinic."),
      p("The EAGLE trial (Lancet 2016) enrolled people aged ≥50 without visually significant cataract, with newly diagnosed primary angle closure and IOP ≥30 mmHg, or primary angle-closure glaucoma. It compared early lens extraction with laser iridotomy. Results should not be generalised to every narrow angle or hyperope."),
      p("Key paper: Azuara-Blanco A et al. Lancet 2016."),
    ],
  },
  "t-yag": {
    title: "YAG capsulotomy and retinal barrier laser",
    tag: "Consent summary",
    meta: "PCO · sealing a tear",
    blocks: [
      h("YAG posterior capsulotomy"),
      p("Not a “returning cataract”. Lens epithelial cells cloud the posterior capsule. Literature: about 20–40% over years. Outpatient laser, no incision. Not every blur needs YAG; a doctor judges whether it affects function. Short pressure rise and extra floaters can occur; retinal tear is uncommon. A shower of new floaters, flashes, a curtain or severe pain after laser: A&E."),
      h("Retinal barrier laser"),
      p("Scars around a tear to reduce fluid going under the retina. Activity limits depend on the tear and the doctor’s instructions — not a blanket two-week sports ban. Laser cannot fix a retina that is already detached. An expanding curtain is an emergency."),
    ],
  },
  "t-mfiol": {
    title: "Multifocal lens — who may not be suitable",
    tag: "Informed choice",
    meta: "Aberration · pupil · fundus",
    blocks: [
      p("A readable summary of why a doctor may advise against a multifocal lens. No single measurement is an absolute cut-off. The choice still needs an in-person visit and consent. This is not a pitch for any model."),
      h("Situations that need extra caution or usually avoid multifocals (qualitative)"),
      ul(["Irregular astigmatism, corneal ectasia or scar, unstable tear film / severe dry eye", "Macular or optic-nerve disease, significant field loss", "Very small pupils or large night pupils; previous corneal refractive surgery", "High night-driving need, high sensitivity to optical side-effects, unrealistic expectations"]),
    ],
  },
  "t-octm": {
    title: "Macular OCT",
    tag: "Imaging",
    meta: "Central thickness · fluid",
    blocks: [
      p("OCT quantifies macular thickness and fluid. Machines are not directly interchangeable. It does not replace a dilated fundus exam. This page explains what a report looks like; it does not interpret your scan."),
    ],
  },
  "t-octrnfl": {
    title: "Glaucoma OCT and visual field",
    tag: "Imaging",
    meta: "RNFL · GCC",
    blocks: [
      p("Retinal nerve-fibre and ganglion-cell maps help monitoring. They are not a diagnosis by themselves and not your personal field score. Combine with IOP, discs and symptoms."),
    ],
  },
  "t-presbyopia": {
    title: "Presbyopia — classes of options",
    tag: "Ageing focus",
    meta: "Reading · glasses · drops · surgery talk",
    blocks: [
      p("Presbyopia is declining accommodation, not a classic refractive error, grouped with refraction because the optical approaches overlap. Options a doctor or optometrist may discuss include spectacles, contact lenses, and — after full examination — lens surgery. Pharmacological approaches, if mentioned, are prescription-only and depend on Hong Kong registration. This page does not sell drops."),
    ],
  },
  "t-protopic": {
    title: "Tacrolimus on the eyelids (off-label)",
    tag: "Off-label",
    meta: "Atopic keratoconjunctivitis · doctor’s guidance",
    blocks: [
      p("Tacrolimus ointment is registered in Hong Kong mainly for dermatology. Use on eyelids for atopic keratoconjunctivitis is off-label. Do not buy it to put in the eye as a drop. A doctor must assess and explain risks. This page names a drug class, not a consumer brand."),
      w("Worse pain, sudden vision drop, clustered blisters (rule out herpes) or yellow-green pus: stop and seek care. The label carries malignancy-related warnings; use the lowest effective dose for the shortest needed course."),
    ],
  },
  "t-ptk": {
    title: "Recurrent corneal erosion and PTK",
    tag: "Morning pain",
    meta: "RCE · epithelial basement-membrane dystrophy",
    blocks: [
      p("The epithelium can tear on waking. Care is stepwise: lubricants and a bandage lens if a doctor advises, then procedures such as diamond burr or PTK in selected cases. Recurrence can still happen; this is not a cure promise."),
    ],
  },
  "t-rd": {
    title: "Retinal detachment, membrane, tear and vitrectomy",
    tag: "Retina surgery education",
    meta: "PPV · stages of care",
    blocks: [
      p("A curtain, sudden field cut or a sharp vision drop is A&E. A tear may be sealed with laser if the retina is still attached. Once detached, surgery (for example vitrectomy or buckle) is a class of emergency treatment. This page does not quote success rates or compare hospitals."),
    ],
  },
  "t-entropion": {
    title: "True involutional entropion",
    tag: "Eyelid turning in",
    meta: "Lashes rub the cornea",
    blocks: [
      h("What it is"),
      p("Ageing lid tissues let the margin turn in so lashes rub the cornea. It is not the same as childhood epiblepharon."),
      h("What a doctor may discuss"),
      ul(["Tape or lubricant as a stopgap", "Surgery to tighten and re-position the lid — type is individual", "This page does not compare brands or quote success rates"]),
    ],
  },
  "t-epiblepharon": {
    title: "Epiblepharon (false entropion)",
    tag: "Children",
    meta: "An extra skin fold",
    blocks: [
      p("A fold of skin pushes lashes inward, common in East Asian children. Many improve with growth. A doctor may discuss lubricant, taping or, if the cornea is damaged, surgery. No success-rate claims here."),
    ],
  },
  "t-ptosis": {
    title: "Ptosis (drooping upper lid)",
    tag: "Lid position",
    meta: "Levator · aponeurosis",
    blocks: [
      h("What it is"),
      p("The upper lid sits too low. Causes include ageing aponeurosis, nerve palsy, muscle disease and childhood ptosis."),
      ul(["New droop with a dilated pupil, double vision or headache — A&E now (rule out third-nerve palsy)", "Childhood ptosis needs early assessment because of amblyopia risk"]),
    ],
  },
  "t-nldo": {
    title: "Nasolacrimal duct obstruction and watering",
    tag: "Tears overflow",
    meta: "Infants · adults",
    blocks: [
      p("Tears cannot drain. Infants often improve in the first year; probing is a later option if a doctor advises. Adults may have inflammation or stone. Surgery classes include DCR. This page lists no branded tubes and no success rates."),
    ],
  },
  "t-strab": {
    title: "Strabismus and amblyopia",
    tag: "Children",
    meta: "Eye alignment · lazy eye",
    blocks: [
      h("What it is"),
      p("Strabismus is misalignment. Amblyopia is a developing brain that never received a clear image; even with glasses one eye stays weaker. Earlier care tends to work better on average, but treatment is not useless after age 6. Older children and teens (about 7–17) can still improve, though average gain falls with age."),
      h("What a doctor may discuss"),
      ul(["Cycloplegic refraction, patching, glasses or prism", "Surgery aligns the eyes; amblyopia therapy still continues", "Adult new double vision can be a neurological emergency"]),
    ],
  },
  "t-child": {
    title: "Children’s vision milestones",
    tag: "For parents",
    meta: "A guide, not a score",
    blocks: [
      p("Rough public-education timing only. Babies start regarding faces in the first weeks. Alignment should settle around 2–3 months. Persistent squint after 3–4 months, a white pupil or nystagmus at any age needs prompt assessment. Preschool is an important window for amblyopia, strabismus and high refractive error."),
    ],
  },
  "t-cl": {
    title: "Contact-lens hygiene",
    tag: "Infection risk",
    meta: "Overnight wear",
    blocks: [
      p("Sleeping in lenses not designed for it raises keratitis risk, including Acanthamoeba with tap water. Wash hands; never rinse lenses or cases in tap water; replace the case as advised. Red, painful, light-sensitive lens-related eyes need same-day assessment."),
    ],
  },
  "t-steroid": {
    title: "Steroid eye drops",
    tag: "Prescription only",
    meta: "Pressure · cataract · infection",
    blocks: [
      p("Steroid drops can raise eye pressure, speed cataract and worsen infection. They are not for unsupervised long-term use from a leftover bottle. A doctor must prescribe, taper and check pressure when needed."),
    ],
  },
  "t-ted": {
    title: "Thyroid eye disease",
    tag: "Orbit",
    meta: "Graves · double vision · optic nerve",
    blocks: [
      p("Autoimmune inflammation of orbital tissues. Smoking worsens it. Urgent: sudden vision drop, colour desaturation, a tight orbit. Care is medical plus ophthalmic, sometimes surgery. This page does not advertise a drug."),
    ],
  },
  "t-roles": {
    title: "Ophthalmologist, optometrist and dispensing",
    tag: "Who does what",
    meta: "Specialist register",
    blocks: [
      p("Eye symptoms should be assessed by a suitably qualified registered healthcare professional. An ophthalmologist in Hong Kong is a Medical Council-registered doctor on the specialist register in ophthalmology, and handles diagnosis, prescription, laser and surgery. Optometrists are registered under the Supplementary Medical Professions Ordinance and mainly test vision, fit glasses/contacts and screen within their scope; they refer eye disease. Dispensing opticians make glasses to a prescription. Only those on the specialist register may use the title 眼科專科醫生. Diagnosis of organic eye disease is not a substitute for an in-person ophthalmologist visit when that is needed."),
    ],
  },
  "t-dilate": {
    title: "After dilation",
    tag: "The day of the exam",
    meta: "Glare and near blur for hours",
    blocks: [
      p("Dilating drops enlarge the pupil and reduce focusing so the lens periphery, vitreous and retina can be seen. Do not drive yourself afterwards. Near work is blurry and light is harsh for hours. If the angle is narrow, a doctor may check it is safe to dilate."),
    ],
  },
  "t-reports": {
    title: "What OCT and visual-field reports look like",
    tag: "Education",
    meta: "A sketch, not a reading of your scan",
    blocks: [
      p("Colour maps and numbers vary by machine. This page shows the idea of thickness and field grey-scale. It cannot interpret your own report. Ask the doctor who ordered it."),
    ],
  },
  "t-pterygium": {
    title: "Pterygium — lifestyle notes",
    tag: "UV",
    meta: "Hats and sunglasses as habits, not a shop",
    blocks: [
      p("UV, wind and dust associate with pterygium. A hat and sunglasses are daily habits, not a product pitch on this site. Surgery is individual if the growth threatens sight or comfort."),
    ],
  },
};
