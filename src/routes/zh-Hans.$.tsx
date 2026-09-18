import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/zh-Hans/$")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
