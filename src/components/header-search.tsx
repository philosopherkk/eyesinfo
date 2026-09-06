import { useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchSite, type SiteSearchHit } from "@/lib/site-search";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { EduLink } from "@/components/edu-link";

function HitLink({
  hit,
  active,
  onPick,
}: {
  hit: SiteSearchHit;
  active: boolean;
  onPick: () => void;
}) {
  const cls = cn(
    "block w-full border-b border-line px-3 py-2.5 text-left no-underline last:border-b-0",
    active ? "bg-navy/8" : "bg-card hover:bg-line/30",
  );
  return (
    <EduLink
      href={hit.href}
      className={cls}
      onClick={onPick}
      role="option"
      aria-selected={active}
    >
      <span className="block text-[0.88rem] font-semibold text-navy">{hit.title}</span>
      {hit.blurb ? (
        <span className="mt-0.5 block text-[0.72rem] leading-snug text-muted line-clamp-2">
          {hit.blurb}
        </span>
      ) : null}
    </EduLink>
  );
}

function navigateToHref(
  navigate: ReturnType<typeof useNavigate>,
  href: string,
) {
  if (href === "/amsler") return void navigate({ to: "/amsler" });
  if (href === "/iol") return void navigate({ to: "/iol" });
  if (href === "/urgent") return void navigate({ to: "/urgent" });
  if (href === "/search") return void navigate({ to: "/search" });
  if (href === "/tools" || href === "/tools/") return void navigate({ to: "/tools" });
  if (href === "/legal") return void navigate({ to: "/legal" });
  if (href === "/privacy") return void navigate({ to: "/privacy" });
  if (href === "/accessibility") return void navigate({ to: "/accessibility" });
  if (href.startsWith("/tools/")) {
    const id = href.split("/").pop() ?? "map";
    return void navigate({ to: "/tools/$toolId", params: { toolId: id } });
  }
  if (href.startsWith("/t/")) {
    const id = href.split("/").pop() ?? "";
    return void navigate({ to: "/t/$topicId", params: { topicId: id } });
  }
  if (href.startsWith("/c/")) {
    const id = href.split("/").pop() ?? "lid";
    return void navigate({ to: "/c/$catId", params: { catId: id } });
  }
  return void navigate({ to: "/" });
}

/** Visible header search — client-side education index only; no analytics. */
export function HeaderSearch() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const hits = useMemo(
    () => (q.trim() ? searchSite(q, locale, t, 8) : []),
    [q, locale, t],
  );

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function goSearchPage() {
    const needle = q.trim();
    setOpen(false);
    void navigate({
      to: "/search",
      search: needle ? { q: needle } : { q: undefined },
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setQ("");
      inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && hits[active]) {
        const href = hits[active].href;
        setOpen(false);
        setQ("");
        navigateToHref(navigate, href);
        return;
      }
      goSearchPage();
    }
  }

  return (
    <div ref={rootRef} className="relative px-4 pb-2.5 no-print">
      <label className="relative block">
        <span className="sr-only">{t("headerSearchLabel")}</span>
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-paper/70"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t("headerSearchPh")}
          className="h-10 w-full rounded-lg border border-paper/25 bg-paper/10 pl-9 pr-9 text-[0.85rem] text-paper placeholder:text-paper/55 outline-none focus-visible:ring-2 focus-visible:ring-paper/60"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={open && q.trim().length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && hits[active] ? `${listId}-opt-${active}` : undefined
          }
        />
        {q ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-paper/80 hover:bg-paper/15"
            aria-label={t("headerSearchClear")}
            onClick={() => {
              setQ("");
              setOpen(false);
              inputRef.current?.focus();
            }}
          >
            <X className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </label>

      {open && q.trim() ? (
        <div
          id={listId}
          role="listbox"
          aria-label={t("headerSearchResults")}
          className="absolute inset-x-4 top-[calc(100%-0.15rem)] z-40 max-h-72 overflow-auto rounded-xl border border-line bg-card shadow-lg"
        >
          {hits.length === 0 ? (
            <p className="px-3 py-4 text-center text-[0.85rem] text-muted">
              {t("searchEmpty")}
            </p>
          ) : (
            hits.map((hit, i) => (
              <div key={hit.id} id={`${listId}-opt-${i}`}>
                <HitLink
                  hit={hit}
                  active={i === active}
                  onPick={() => {
                    setOpen(false);
                    setQ("");
                  }}
                />
              </div>
            ))
          )}
          <button
            type="button"
            className="flex w-full items-center justify-center border-t border-line bg-line/20 px-3 py-2.5 text-[0.78rem] font-semibold text-navy"
            onClick={goSearchPage}
          >
            {t("headerSearchAll")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
