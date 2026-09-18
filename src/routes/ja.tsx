import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/** Interim: any `/ja` URL → TC home. Do not serve JA clinical chrome. */
export const Route = createFileRoute("/ja")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
  component: () => <Outlet />,
});
