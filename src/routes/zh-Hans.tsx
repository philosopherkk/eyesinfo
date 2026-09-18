import { createFileRoute } from "@tanstack/react-router";
import { LocaleLayout } from "@/components/locale-layout";

export const Route = createFileRoute("/zh-Hans")({
  component: () => <LocaleLayout locale="zh-Hans" />,
});
