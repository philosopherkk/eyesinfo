import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { pageHead, seoSiteName } from "@/lib/page-seo";

export const Route = createFileRoute("/ja/")({
  head: () =>
    pageHead({
      title: seoSiteName("ja"),
      description:
        "香港の眼科公衆教育：よくある眼疾患、解説とセルフチェック用具。登録眼科医の診察の代わりにはなりません。",
      path: "/ja",
      locale: "ja",
    }),
  component: HomePage,
});
