import { Outlet } from 'react-router-dom';
import { LayoutGrid, Package, ShoppingCart, Settings, Store } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/vendor', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/vendor/products', label: 'Products', icon: Package },
  { to: '/vendor/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/vendor/store', label: 'Store settings', icon: Store },
];

export default function VendorLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex bg-parchment">
      <DashboardSidebar
        title="Vendor Stall"
        subtitle={user?.name}
        links={links}
        accentPath="/vendor"
      />
      <div className="flex-1 min-w-0">
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
