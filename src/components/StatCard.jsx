export default function StatCard({ label, value, delta, icon: Icon, tone = 'ok' }) {
  const toneColor = {
    ok: 'text-ok',
    warn: 'text-warn',
    danger: 'text-danger',
  }[tone];

  return (
    <div className="bg-white rounded-2xl border border-ink/10 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-ink/50 font-semibold">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-ink/30" />}
      </div>
      <div className="font-display text-3xl font-semibold text-ink mt-2">{value}</div>
      {delta && <div className={`text-xs mt-1 font-mono ${toneColor}`}>{delta}</div>}
    </div>
  );
}
