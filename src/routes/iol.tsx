import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { IolScene } from "@/components/iol-scene";
import { LegalBanner } from "@/components/legal-banner";
import { EditorialFooter } from "@/components/editorial-footer";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  DISTANCES,
  OPTICS,
  RANGE_STOPS,
  astigDefocus,
  contrastLoss,
  formatD,
  formatDegrees,
  haloStrength,
  sphereDefocus,
  type Optic,
} from "@/lib/iol-optics";

export const Route = createFileRoute("/iol")({ component: IolPage });

const TARGETS = Array.from({ length: 17 }, (_, i) =>
  Number((2 - i * 0.25).toFixed(2)),
);

function IolPage() {
  const { t, tx } = useI18n();
  const [optic, setOptic] = useState<Optic>("mono");
  const [target, setTarget] = useState(0);
  const [cyl, setCyl] = useState(0);
  const [toric, setToric] = useState(false);
  const [night, setNight] = useState(false);
  const [glasses, setGlasses] = useState(false);

  const astig = glasses ? 0 : astigDefocus(cyl, toric);
  const contrast = glasses ? 0 : contrastLoss(optic);
  const halo = haloStrength(optic, night);
  const meta = OPTICS.find((o) => o.id === optic)!;

  const scenes = useMemo(
    () =>
      DISTANCES.map((d) => {
        const sph = glasses ? 0 : sphereDefocus(optic, target, d.demand);
        const src =
          d.id === "far" && night ? "/iol/night.jpg" : d.img;
        const sample =
          d.id === "far" ? "巴士 112" : d.id === "mid" ? "羽毛球公開賽" : "週日賽程";
        return { ...d, src, sph, sample };
      }),
    [optic, target, glasses, night],
  );

  return (
    <div className="pb-8">
      <div className="flex items-center gap-1 px-2 pt-3">
        <Link
          to="/"
          className="grid size-10 place-items-center rounded-md text-navy no-underline"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-[1.25rem] font-semibold text-navy">
          {t("iolTitle")}
        </h1>
      </div>
      <p className="px-4 pt-1 text-[0.88rem] leading-relaxed text-muted">
        拖動目標度數，比較遠、中、近看起來差多少。只是光學示意，不能預測你手術後的視力，亦不是推介任何晶體品牌。
      </p>

      <section className="mt-4 px-4">
        <h2 className="text-[0.8rem] font-semibold text-muted">光學設計</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {OPTICS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOptic(o.id)}
              className={cn(
                "min-h-12 rounded-xl border px-3 py-2 text-left",
                optic === o.id
                  ? "border-navy bg-navy text-paper"
                  : "border-line bg-card text-ink",
              )}
            >
              <span className="block text-[0.88rem] font-semibold">
                {o.title}
              </span>
              <span
                className={cn(
                  "block text-[0.7rem]",
                  optic === o.id ? "text-paper/75" : "text-muted",
                )}
              >
                {o.short}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">
          {meta.note}
        </p>
      </section>

      <section className="mt-5 px-4">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-[0.8rem] font-semibold text-muted">
            單焦／預留目標度數
          </h2>
          <p className="text-[0.85rem] font-semibold text-navy">
            {formatD(target)} · {formatDegrees(target)}
          </p>
        </div>
        <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">
          由遠視 +2.00（不夠度）拖到近視 −2.00（預留近用）。多焦通常以正視為目標；偏離會令各個焦點一齊移位。
        </p>
        <input
          type="range"
          min={0}
          max={16}
          step={1}
          value={TARGETS.indexOf(target)}
          onChange={(e) => setTarget(TARGETS[Number(e.target.value)] ?? 0)}
          className="mt-3 w-full accent-[var(--color-navy)]"
          aria-label="目標球面度數"
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-faint">
          <span>+2.00 遠視</span>
          <span>0 正視</span>
          <span>−2.00 近視</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { t: 2, l: "+2.00 不夠度" },
            { t: 0, l: "0 正視看遠" },
            { t: -2, l: "−2.00 預留近用" },
          ].map((b) => (
            <button
              key={b.t}
              type="button"
              onClick={() => setTarget(b.t)}
              className={cn(
                "h-11 rounded-xl border text-[0.72rem] font-semibold",
                target === b.t
                  ? "border-navy bg-navy text-paper"
                  : "border-line bg-card text-navy",
              )}
            >
              {b.l}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-[0.8rem] font-semibold text-muted">
            角膜散光（環曲面／Toric）
          </h2>
          <p className="text-[0.85rem] font-semibold text-navy">
            {cyl.toFixed(2)} D
            {cyl > 0 ? `（${Math.round(cyl * 100)} 度）` : ""}
          </p>
        </div>
        <input
          type="range"
          min={0}
          max={2.5}
          step={0.25}
          value={cyl}
          onChange={(e) => setCyl(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--color-navy)]"
          aria-label="未矯正角膜散光"
        />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { c: 0, l: "0 無散光" },
            { c: 1, l: "1.00 D" },
            { c: 2, l: "2.00 D" },
          ].map((b) => (
            <button
              key={b.c}
              type="button"
              onClick={() => setCyl(b.c)}
              className={cn(
                "h-11 rounded-xl border text-[0.75rem] font-semibold",
                cyl === b.c
                  ? "border-navy bg-navy text-paper"
                  : "border-line bg-card text-navy",
              )}
            >
              {b.l}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setToric((v) => !v)}
          className={cn(
            "mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border text-[0.85rem] font-semibold",
            toric
              ? "border-navy bg-navy text-paper"
              : "border-line bg-card text-navy",
          )}
        >
          {toric ? "已選擇散光矯正晶體" : "未用散光矯正晶體"}
        </button>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
          散光是某一方向拉長模糊，與「遠或近」不是同一件事。規則角膜散光大約 ≥0.75–1.00
          D 時，醫生或會討論環曲面晶體，可加在單焦、增強單焦、延伸景深或多焦之上。晶體旋轉會減少矯正量。
        </p>
      </section>

      <section className="mt-4 flex gap-2 px-4">
        <button
          type="button"
          onClick={() => setNight((v) => !v)}
          className={cn(
            "inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border text-[0.82rem] font-semibold",
            night
              ? "border-navy bg-navy text-paper"
              : "border-line bg-card text-navy",
          )}
        >
          {night ? <Moon className="size-4" /> : <Sun className="size-4" />}
          {night ? "夜間光暈" : "日間街景"}
        </button>
        <button
          type="button"
          onClick={() => setGlasses((v) => !v)}
          className={cn(
            "inline-flex h-11 flex-1 items-center justify-center rounded-xl border text-[0.82rem] font-semibold",
            glasses
              ? "border-navy bg-navy text-paper"
              : "border-line bg-card text-navy",
          )}
        >
          {glasses ? "已戴眼鏡矯正" : "不戴眼鏡"}
        </button>
      </section>
      {glasses ? (
        <p className="px-4 pt-2 text-[0.78rem] text-muted">
          眼鏡可補球面及散光殘餘，但多焦／延伸景深的光暈不會因戴鏡而消失。
        </p>
      ) : null}

      <section className="mt-5 px-4">
        <h2 className="mb-2 text-[0.8rem] font-semibold text-muted">
          清晰範圍示意
        </h2>
        <div className="grid grid-cols-5 gap-1">
          {RANGE_STOPS.map((s) => {
            const d =
              (glasses ? 0 : sphereDefocus(optic, target, s.demand)) + astig;
            const h = Math.max(12, Math.round((1 - Math.min(1, d / 2.2)) * 56));
            return (
              <div key={s.label} className="flex flex-col items-center">
                <div className="flex h-14 items-end">
                  <div
                    className="w-6 rounded-sm bg-navy"
                    style={{ height: h, opacity: 0.35 + (h / 56) * 0.65 }}
                  />
                </div>
                <span className="mt-1 text-[0.65rem] text-muted">{s.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5 grid gap-3 px-4">
        {scenes.map((s) => (
          <IolScene
            key={s.id}
            src={s.src}
            title={s.title}
            sub={s.sub}
            sample={s.sample}
            sphere={s.sph}
            astig={astig}
            contrast={contrast}
            halo={s.id === "far" ? halo : 0}
            night={s.id === "far" && night}
            optic={optic === "mf" ? "mf" : optic === "edof" ? "edof" : "mono"}
          />
        ))}
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-[1.05rem] font-semibold text-navy">如何閱讀這個示意</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.88rem] leading-relaxed">
          <li>
            單焦預留 <strong>正視 0</strong>
            ：看街、開車通常最清楚；中距離賽事新聞及近距離賽程多數要近用鏡。
          </li>
          <li>
            單焦預留 <strong>近視 −2.00</strong>
            ：約 50 厘米閱讀較易，遠處路牌會糊。有人一眼正視、一眼輕微近視（迷你單眼視），須個別討論。
          </li>
          <li>
            單焦預留 <strong>遠視 +2.00</strong>
            ：遠近都不夠焦，是「晶體度數偏少」的示範，不是常用目標。
          </li>
          <li>增強型單焦：中距離往往比普通單焦好一點，細字多數仍需鏡。</li>
          <li>延伸景深：遠到中距離較連貫，細字仍常需鏡，夜間光暈因產品而異。</li>
          <li>
            多焦／三焦：遠中近都嘗試兼顧，對比可略降，夜間光暈較明顯。不是人人適合，不是術後保證。
          </li>
        </ul>
      </section>

      <div className="mt-5 flex flex-wrap gap-2 px-4">
        <Link
          to="/t/$topicId"
          params={{ topicId: "t-iol" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          晶體選擇細節
        </Link>
        <Link
          to="/t/$topicId"
          params={{ topicId: "t-mfiol" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          多焦篩選原則
        </Link>
        <Link
          to="/tools/$toolId"
          params={{ toolId: "halo" }}
          className="inline-flex h-11 items-center rounded-full border border-line bg-card px-4 text-[0.85rem] font-semibold text-navy no-underline"
        >
          夜間光暈比較
        </Link>
      </div>
      <div className="px-4">
        <p className="mt-6 text-[0.78rem] leading-relaxed text-faint">
          示意／自我監察不能代替散瞳眼底、視野或光學相干斷層掃描（OCT）。此工具結果正常不能排除眼疾。不是術後保證。本站不提供預約或轉介。
        </p>
        <EditorialFooter />
        <LegalBanner compact />
      </div>
    </div>
  );
}
