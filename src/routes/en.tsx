import { createFileRoute } from "@tanstack/react-router";
import { LocaleLayout } from "@/components/locale-layout";

export const Route = createFileRoute("/en")({
  component: () => <LocaleLayout locale="en" />,
});
