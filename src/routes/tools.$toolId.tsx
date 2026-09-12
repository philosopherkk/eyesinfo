import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { TOOLS, type ToolId } from "@/data/tools";
import { SimDisclaimer } from "@/components/sim-disclaimer";
import { EduToolCaveat } from "@/components/edu-tool-caveat";
import { EditorialFooter } from "@/components/editorial-footer";
import { SaveButton } from "@/components/save-button";
import { EyeMap } from "@/components/eye-map";
import { EyeAnatomyViewer } from "@/components/eye-anatomy-viewer";
import { FloaterDemo, HaloDemo, HazeDemo, TunnelDemo } from "@/components/tool-demos";
import { DropTrainer, OutdoorCard, WarmTimer } from "@/components/care-tools";
import { AskDoctor, RxDecoder, VisitWalk } from "@/components/ask-visit-rx";
import { toolSaveKey } from "@/lib/saved";
import { useI18n, TOOL_TEXT } from "@/i18n";
import { pageHead } from "@/lib/page-seo";

export const Route = createFileRoute("/tools/$toolId")({
  head: ({ params }) => {
    const tool = TOOLS.find(
      (item) => item.id === params.toolId && item.href.startsWith("/tools/"),
    );
    const title = tool?.title ?? "教育工具";
    const description =
      tool?.blurb
        ? `${tool.blurb}。公眾教育工具，不能代替檢查或面診。`
        : "眼科公眾教育工具。不能代替檢查或面診。";
    return pageHead({
      title,
      description,
      path: `/tools/${params.toolId}`,
    });
  },
  component: ToolPage,
});

const EDU_CAVEAT_TOOLS = new Set<ToolId>(["map", "drops", "ask", "outdoor", "visit", "rx"]);

function ToolPage() {
  const { toolId } = Route.useParams();
  const tool = TOOLS.find((item) => item.id === toolId && item.href.startsWith("/tools/"));
  const { t, locale } = useI18n();
  if (!tool) throw notFound();
  const text = TOOL_TEXT[locale][tool.id];
  const showEduCaveat = EDU_CAVEAT_TOOLS.has(tool.id);

  return (
    <div className="pb-8">
      <div className="flex items-start gap-1 px-2 pt-3">
        <Link
          to="/tools"
          className="grid size-11 shrink-0 place-items-center rounded-md text-navy no-underline"
          aria-label={t("backTools")}
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <div className="min-w-0 flex-1 pt-1">
          <h1 className="text-[1.2rem] font-semibold text-navy">{text.title}</h1>
          <p className="text-[0.75rem] text-steel">{text.canto}</p>
        </div>
        <SaveButton saveId={toolSaveKey(tool.id)} className="mr-2 mt-0.5" />
      </div>
      <div className="px-4 pt-3">
        {showEduCaveat ? <EduToolCaveat /> : null}
        <Panel id={tool.id} />
        <SimDisclaimer />
        <EditorialFooter
          lastReviewed={tool.id === "map" ? "2026-09-05" : undefined}
        />
      </div>
    </div>
  );
}

function Panel({ id }: { id: ToolId }) {
  const { tx } = useI18n();
  switch (id) {
    case "map":
      return (
        <div className="space-y-8">
          <EyeAnatomyViewer />
          <div>
            <h2 className="mb-2 text-[0.85rem] font-semibold text-muted">
              {tx("正面／側面簡圖")}
            </h2>
            <EyeMap />
          </div>
        </div>
      );
    case "tunnel":
      return <TunnelDemo />;
    case "haze":
      return <HazeDemo />;
    case "floaters":
      return <FloaterDemo />;
    case "halo":
      return <HaloDemo />;
    case "drops":
      return <DropTrainer />;
    case "warm":
      return <WarmTimer />;
    case "ask":
      return <AskDoctor />;
    case "visit":
      return <VisitWalk />;
    case "outdoor":
      return <OutdoorCard />;
    case "rx":
      return <RxDecoder />;
    default:
      return null;
  }
}
