import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Route Link for education paths only (topics, tools, categories, static pages). */
export function EduLink({
  href,
  className,
  children,
  onClick,
  role,
  "aria-selected": ariaSelected,
  "aria-current": ariaCurrent,
  "aria-label": ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  role?: string;
  "aria-selected"?: boolean;
  "aria-current"?: "page" | undefined;
  "aria-label"?: string;
}) {
  const props = {
    className,
    onClick,
    role,
    "aria-selected": ariaSelected,
    "aria-current": ariaCurrent,
    "aria-label": ariaLabel,
  };

  if (href === "/") return <Link to="/" {...props}>{children}</Link>;
  if (href === "/amsler") return <Link to="/amsler" {...props}>{children}</Link>;
  if (href === "/iol") return <Link to="/iol" {...props}>{children}</Link>;
  if (href === "/urgent") return <Link to="/urgent" {...props}>{children}</Link>;
  if (href === "/search") return <Link to="/search" {...props}>{children}</Link>;
  if (href === "/tools" || href === "/tools/") return <Link to="/tools" {...props}>{children}</Link>;
  if (href === "/saved") return <Link to="/saved" {...props}>{children}</Link>;
  if (href === "/legal") return <Link to="/legal" {...props}>{children}</Link>;
  if (href === "/privacy") return <Link to="/privacy" {...props}>{children}</Link>;
  if (href === "/accessibility") return <Link to="/accessibility" {...props}>{children}</Link>;
  if (href === "/clinic") return <Link to="/clinic" {...props}>{children}</Link>;
  if (href === "/install") return <Link to="/install" {...props}>{children}</Link>;
  if (href === "/qr") return <Link to="/qr" {...props}>{children}</Link>;

  if (href.startsWith("/tools/")) {
    const id = href.split("/").pop() ?? "map";
    return (
      <Link to="/tools/$toolId" params={{ toolId: id }} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("/t/")) {
    const id = href.split("/").pop() ?? "";
    return (
      <Link to="/t/$topicId" params={{ topicId: id }} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("/c/")) {
    const id = href.split("/").pop() ?? "lid";
    return (
      <Link to="/c/$catId" params={{ catId: id }} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/" {...props}>
      {children}
    </Link>
  );
}
