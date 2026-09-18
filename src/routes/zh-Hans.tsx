import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/** Interim: any `/zh-Hans` URL → TC home. Do not serve 简 clinical chrome. */
export const Route = createFileRoute("/zh-Hans")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => <Outlet />,
});
