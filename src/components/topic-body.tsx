import type { Block } from "@/data/topics";

export function TopicBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === "h") {
          return (
            <h3
              key={i}
              className="pt-1 text-[0.95rem] font-semibold tracking-tight text-navy"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "p") {
          return (
            <p key={i} className="text-[0.95rem] leading-relaxed text-ink">
              {block.text}
            </p>
          );
        }
        if (block.type === "warn") {
          return (
            <div
              key={i}
              className="rounded-lg border border-danger/30 bg-danger-bg px-3.5 py-3 text-[0.9rem] leading-relaxed text-danger"
            >
              {block.text}
            </div>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const Tag = block.type;
          return (
            <Tag
              key={i}
              className={
                block.type === "ol"
                  ? "list-decimal space-y-1.5 pl-5 text-[0.92rem] leading-relaxed"
                  : "list-disc space-y-1.5 pl-5 text-[0.92rem] leading-relaxed"
              }
            >
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </Tag>
          );
        }
        if (block.type !== "table") return null;
        const [head, ...rows] = block.rows;
        return (
          <div key={i} className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[18rem] border-collapse text-left text-[0.8rem]">
              {head ? (
                <thead>
                  <tr className="bg-navy text-paper">
                    {head.map((cell, j) => (
                      <th key={j} className="px-2.5 py-2 font-semibold">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {rows.map((row, r) => (
                  <tr
                    key={r}
                    className={r % 2 === 0 ? "bg-card" : "bg-paper/70"}
                  >
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className="border-t border-line px-2.5 py-2 align-top leading-snug"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
