import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/i18n/locale";

export type AmslerResult = "same" | "warp" | "spot";

export type AmslerNote = {
  t: number;
  result: AmslerResult;
};

type Prefs = {
  fontPx: number;
  locale: Locale;
  saved: string[];
  amslerPxPerMm: number | null;
  amslerNotes: AmslerNote[];
  outdoorDay: string;
  outdoorMin: number;
  setFontPx: (n: number) => void;
  setLocale: (l: Locale) => void;
  setAmslerPxPerMm: (n: number | null) => void;
  addAmslerNote: (result: AmslerResult) => void;
  clearAmslerNotes: () => void;
  addOutdoor: (min: number) => void;
  resetOutdoorIfNewDay: () => void;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const MIN = 16;
const MAX = 24;
const DEF = 17;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export const usePrefs = create<Prefs>()(
  persist(
    (set, get) => ({
      fontPx: DEF,
      locale: "zh-Hant",
      saved: [],
      amslerPxPerMm: null,
      amslerNotes: [],
      outdoorDay: "",
      outdoorMin: 0,
      setFontPx: (n) => set({ fontPx: Math.min(MAX, Math.max(MIN, n)) }),
      setLocale: (l) => set({ locale: l }),
      setAmslerPxPerMm: (n) => set({ amslerPxPerMm: n }),
      addAmslerNote: (result) =>
        set((s) => ({
          amslerNotes: [...s.amslerNotes.slice(-29), { t: Date.now(), result }],
        })),
      clearAmslerNotes: () => set({ amslerNotes: [] }),
      addOutdoor: (min) => {
        const day = todayKey();
        const s = get();
        const cur = s.outdoorDay === day ? s.outdoorMin : 0;
        set({ outdoorDay: day, outdoorMin: Math.min(480, cur + min) });
      },
      resetOutdoorIfNewDay: () => {
        const day = todayKey();
        const s = get();
        if (s.outdoorDay !== day) set({ outdoorDay: day, outdoorMin: 0 });
      },
      toggleSaved: (id) =>
        set((s) => ({
          saved: s.saved.includes(id)
            ? s.saved.filter((x) => x !== id)
            : [...s.saved, id],
        })),
      isSaved: (id) => get().saved.includes(id),
    }),
    { name: "eye-edu-prefs" },
  ),
);

export const FONT = { min: MIN, max: MAX, def: DEF };
