import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { pageHead, SEO_SITE_NAME } from "@/lib/page-seo";

export const Route = createFileRoute("/en/")({
  head: () =>
    pageHead({
      title: SEO_SITE_NAME,
      description:
        "Hong Kong public eye-health education: common conditions, fact sheets and self-check tools. Not a substitute for seeing a registered ophthalmologist.",
      path: "/en",
    }),
  component: HomePage,
});
