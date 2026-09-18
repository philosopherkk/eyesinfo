import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Alias shell — children redirect to `/zh-Hans`. */
export const Route = createFileRoute("/zh-CN")({
  component: () => <Outlet />,
});
