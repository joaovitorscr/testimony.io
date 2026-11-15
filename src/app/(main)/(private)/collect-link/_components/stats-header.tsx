/** The project's link counts as a ruled stats row. */
export function StatsHeader({
  stats,
}: {
  stats: { total: number; active: number; used: number; cancelled: number };
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
      <Stat label="Total links" value={stats.total} />
      <Stat label="Active" value={stats.active} />
      <Stat label="Collected" value={stats.used} />
      <Stat label="Cancelled" value={stats.cancelled} />
    </dl>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col-reverse gap-1 border-t pt-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="type-hero tabular-nums">{value}</dd>
    </div>
  );
}
