import { NavLink, Link } from 'react-router-dom';

export default function DashboardSidebar({ title, subtitle, links, accentPath }) {
  return (
    <aside className="w-60 shrink-0 bg-ink text-parchment min-h-screen flex flex-col">
      <Link to={accentPath ?? '/'} className="px-6 py-5 border-b border-linen/10">
        <div className="font-display text-xl font-semibold text-linen">Bazaar</div>
        <div className="text-[11px] uppercase tracking-widest text-marigold mt-0.5">{title}</div>
        {subtitle && <div className="text-xs text-parchment/50 mt-1">{subtitle}</div>}
      </Link>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-marigold/15 text-marigold'
                  : 'text-parchment/70 hover:bg-linen/5 hover:text-linen'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-linen/10 text-xs text-parchment/40">
        Demo data — nothing here is persisted to a server.
      </div>
    </aside>
  );
}
