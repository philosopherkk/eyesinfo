import { createFileRoute } from "@tanstack/react-router";
import { LocaleLayout } from "@/components/locale-layout";

export const Route = createFileRoute("/ja")({
  component: () => <LocaleLayout locale="ja" />,
});
