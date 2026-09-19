import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/zh-CN/$")({
  beforeLoad: ({ params }) => {
    const rest = params._splat ?? "";
    throw redirect({
      href: rest ? `/zh-Hans/${rest}` : "/zh-Hans",
      replace: true,
    });
  },
});
