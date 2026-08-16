import { useNavigate } from 'react-router-dom';
import { User, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roles = [
  { key: 'customer', label: 'Customer', desc: 'Browse and buy from every stall', icon: User, to: '/' },
  { key: 'vendor', label: 'Vendor', desc: 'Manage your stall, products & orders', icon: Store, to: '/vendor' },
  { key: 'admin', label: 'Admin', desc: 'Oversee vendors, orders & the whole market', icon: ShieldCheck, to: '/admin' },
];

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const pick = (role, to) => {
    login(role);
    navigate(to);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <div className="stall-number text-clay text-xs mb-1">DEMO ACCESS</div>
        <h1 className="font-display text-4xl font-semibold text-ink">Sign in as…</h1>
        <p className="text-ink/60 mt-2">This is a front-end demo — pick a role to preview that experience.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {roles.map(({ key, label, desc, icon: Icon, to }) => (
          <button
            key={key}
            onClick={() => pick(key, to)}
            className="bg-white border border-ink/10 rounded-2xl p-6 text-left hover:border-marigold hover:shadow-lg hover:shadow-ink/5 transition-all"
          >
            <Icon className="w-6 h-6 text-clay mb-3" />
            <div className="font-display text-lg font-semibold text-ink">{label}</div>
            <div className="text-sm text-ink/60 mt-1">{desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
