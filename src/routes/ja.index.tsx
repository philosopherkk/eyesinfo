import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { pageHead, SEO_SITE_NAME } from "@/lib/page-seo";

export const Route = createFileRoute("/ja/")({
  head: () =>
    pageHead({
      title: SEO_SITE_NAME,
      description:
        "香港の眼科公衆教育：よくある眼疾患、解説とセルフチェック用具。登録眼科医の診察の代わりにはなりません。",
      path: "/ja",
    }),
  component: HomePage,
});
