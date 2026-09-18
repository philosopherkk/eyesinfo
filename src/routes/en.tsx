import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/** Interim: any `/en` URL → TC home. Do not serve EN clinical chrome. */
export const Route = createFileRoute("/en")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => <Outlet />,
});
