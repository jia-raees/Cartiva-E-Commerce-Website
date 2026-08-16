import { Outlet } from 'react-router-dom';
import { LayoutGrid, Store, Users, ShoppingCart, Tags } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/admin/vendors', label: 'Vendors', icon: Store },
  { to: '/admin/users', label: 'Customers', icon: Users },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
];

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex bg-parchment">
      <DashboardSidebar
        title="Admin Panel"
        subtitle={user?.name}
        links={links}
        accentPath="/admin"
      />
      <div className="flex-1 min-w-0">
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
