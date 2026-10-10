import { useI18n } from "@/i18n";

/**
 * Scannable “重點” bullets near the top of a topic page.
 * Education only — bullets must come from approved topic data (no invented claims).
 */
export function KeyPointsCard({ points }: { points: string[] }) {
  const { t } = useI18n();
  if (points.length === 0) return null;

  return (
    <section
      className="mb-4 rounded-lg border border-line bg-line/25 px-3.5 py-3"
      aria-labelledby="topic-key-points-title"
    >
      <h2
        id="topic-key-points-title"
        className="text-[0.9rem] font-semibold tracking-tight text-navy"
      >
        {t("keyPointsTitle")}
      </h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9rem] leading-relaxed text-ink">
        {points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
