import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { TOOLS, type ToolDef } from "@/data/tools";
import { useI18n, TOOL_TEXT } from "@/i18n";

export const Route = createFileRoute("/tools/")({ component: ToolsHub });

function ToolsHub() {
  const { t, locale } = useI18n();
  const text = TOOL_TEXT[locale];
  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-[1.35rem] font-semibold text-navy">{t("toolsTitle")}</h1>
      <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{t("toolsLead")}</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
        {TOOLS.map((item) => (
          <ToolRow key={item.id} tool={item} title={text[item.id].title} blurb={`${text[item.id].blurb} · ${text[item.id].canto}`} />
        ))}
      </div>
    </div>
  );
}

function ToolRow({
  tool,
  title,
  blurb,
}: {
  tool: ToolDef;
  title: string;
  blurb: string;
}) {
  const inner = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-[0.78rem] text-muted">{blurb}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-faint" />
    </>
  );
  const cls =
    "flex items-center gap-3 border-b border-line px-4 py-3.5 no-underline last:border-b-0";
  if (tool.id === "amsler") {
    return (
      <Link to="/amsler" className={cls}>
        {inner}
      </Link>
    );
  }
  if (tool.id === "iol") {
    return (
      <Link to="/iol" className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to="/tools/$toolId" params={{ toolId: tool.id }} className={cls}>
      {inner}
    </Link>
  );
}
