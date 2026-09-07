import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Topic } from "@/data/topics";
import { topicCardTitle } from "@/data/topics";
import { useLocalizedTopic } from "@/i18n";

export function TopicRow({ topic }: { topic: Topic }) {
  const loc = useLocalizedTopic(topic);
  const cardTitle = topicCardTitle(loc.title);
  const sub = loc.meta || loc.tag;
  return (
    <Link
      to="/t/$topicId"
      params={{ topicId: topic.id }}
      className="flex items-center gap-3 border-b border-line px-4 py-3.5 no-underline last:border-b-0"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-navy text-[0.72rem] font-semibold text-paper">
        {loc.num}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug text-ink">
          {cardTitle}
        </span>
        {sub ? (
          <span className="mt-0.5 block text-[0.78rem] leading-snug text-muted">
            {sub}
          </span>
        ) : null}
      </span>
      {loc.tag ? (
        <span className="hidden max-w-24 truncate rounded-full bg-paper px-2 py-0.5 text-[0.68rem] text-steel sm:inline">
          {loc.tag}
        </span>
      ) : null}
      <ChevronRight className="size-4 shrink-0 text-faint" />
    </Link>
  );
}
