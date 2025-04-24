import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type UserRole = 'passenger' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface LoginParams {
  email: string;
  password: string;
  name?: string;
  isSignUp?: boolean;
  role?: UserRole;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (params: LoginParams) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('skyHubUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('skyHubUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async ({ email, password, name, isSignUp, role = 'passenger' }: LoginParams): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isSignUp) {
      const newUser: User = {
        id: Math.random().toString(36).substring(2),
        name: name || email.split('@')[0],
        email,
        role,
      };
      
      const existingUsers = JSON.parse(localStorage.getItem('skyHubUsers') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === email);
      
      if (userExists) {
        return false;
      }
      
      localStorage.setItem('skyHubUsers', JSON.stringify([...existingUsers, newUser]));
      localStorage.setItem('skyHubUser', JSON.stringify(newUser));
      setUser(newUser);
      toast.success(`Welcome ${newUser.name}! Your account has been created and you are now logged in.`);
      return true;
    } else {
      const existingUsers = JSON.parse(localStorage.getItem('skyHubUsers') || '[]');
      const foundUser = existingUsers.find((u: any) => u.email === email);
      
      if (foundUser) {
        localStorage.setItem('skyHubUser', JSON.stringify(foundUser));
        setUser(foundUser);
        toast.success(`Welcome back, ${foundUser.name}! You are now logged in and ready to use SkyHub.`);
        return true;
      }
      
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('skyHubUser');
    setUser(null);
    toast.info('You have been logged out.');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        isAdmin, 
        login, 
        logout 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserAuth = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
