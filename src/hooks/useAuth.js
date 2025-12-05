import { useState } from 'react';

// Very simple mock auth hook
export function useAuth() {
  const [user, setUser] = useState(null);

  const login = (role, email) => {
    setUser({ role, email });
  };

  const logout = () => setUser(null);

  return { user, login, logout };
}

