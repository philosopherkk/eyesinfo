import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { pageHead, seoSiteName } from "@/lib/page-seo";

export const Route = createFileRoute("/en/")({
  head: () =>
    pageHead({
      title: seoSiteName("en"),
      description:
        "Hong Kong public eye-health education: common conditions, fact sheets and self-check tools. Not a substitute for seeing a registered ophthalmologist.",
      path: "/en",
      locale: "en",
    }),
  component: HomePage,
});
