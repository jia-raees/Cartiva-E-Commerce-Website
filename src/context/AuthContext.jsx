import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = {
  customer: { name: 'Elena Marsh', role: 'customer', email: 'elena@example.com' },
  vendor: { name: 'Thistle & Loom', role: 'vendor', vendorId: 'v1', email: 'shop@thistleandloom.com' },
  admin: { name: 'Priya Anand', role: 'admin', email: 'priya@bazaar.app' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaar_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (role) => {
    const demoUser = DEMO_USERS[role] ?? DEMO_USERS.customer;
    setUser(demoUser);
    localStorage.setItem('bazaar_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bazaar_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
