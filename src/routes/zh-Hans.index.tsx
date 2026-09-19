import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { pageHead, SEO_SITE_NAME } from "@/lib/page-seo";

export const Route = createFileRoute("/zh-Hans/")({
  head: () =>
    pageHead({
      title: SEO_SITE_NAME,
      description:
        "香港眼科公众教育：常见眼疾、专题单张与自我监察工具。不能代替与注册眼科专科医生的面诊。",
      path: "/zh-Hans",
    }),
  component: HomePage,
});
