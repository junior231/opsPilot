type Props = {
  label: string;
  value: number;
  trend?: 'up' | 'down' | 'flat';
};

export function KpiCard({ label, value, trend }: Props) {
  const trendColor =
    trend === 'up'
      ? 'text-emerald-600'
      : trend === 'down'
        ? 'text-rose-600'
        : 'text-slate-400';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        {trend && (
          <span className={`text-xs ${trendColor}`}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
          </span>
        )}
      </div>
    </div>
  );
}
