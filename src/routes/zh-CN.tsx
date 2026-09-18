import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/zh-CN")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => <Outlet />,
});
