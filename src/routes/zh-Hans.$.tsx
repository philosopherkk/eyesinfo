import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/zh-Hans/$")({
  beforeLoad: ({ params }) => {
    const rest = params._splat ?? "";
    const base = rest ? `/${rest}` : "/";
    throw redirect({
      href: `${base}${base.includes("?") ? "&" : "?"}lang=zh-Hans`,
      replace: true,
    });
  },
});
