import type { ChangelogEntry } from '#/data/changelog'

type ChangelogTimelineProps = {
  entries: ChangelogEntry[]
}

export function ChangelogTimeline({ entries }: ChangelogTimelineProps) {
  return (
    <div className="border-l-2 border-[var(--line)] pl-8 space-y-12">
      {entries.map((entry, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-[var(--background)] bg-[var(--lagoon)] shadow-[0_0_10px_var(--lagoon)]" />
          <p className="text-sm font-bold text-[var(--lagoon)] mb-2">
            {entry.date}
          </p>
          <h3 className="text-xl font-bold text-[var(--sea-ink)] mb-3">
            {entry.title}
          </h3>
          <p className="text-[var(--sea-ink-soft)] leading-relaxed">
            {entry.description}
          </p>
        </div>
      ))}
    </div>
  )
}
