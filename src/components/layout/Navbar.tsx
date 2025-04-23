
import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserAuth } from '@/hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-end shadow-sm">
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative transition-transform hover:scale-105">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-md border-gray-200 shadow-md">
              <DropdownMenuLabel className="font-medium">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-gray-50 rounded-sm cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Flight UA234 delayed</span>
                  <span className="text-sm text-gray-500">10 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 rounded-sm cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Gate change: DL194 moved to Gate B7</span>
                  <span className="text-sm text-gray-500">25 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 rounded-sm cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Staff scheduling update required</span>
                  <span className="text-sm text-gray-500">1 hour ago</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 transition-colors hover:bg-gray-50">
                <div className="size-9 rounded-full bg-gradient-to-br from-airport-primary to-airport-secondary flex items-center justify-center shadow-sm">
                  <User className="text-white h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Airport Manager' : 'Customer'}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-md border-gray-200 shadow-md w-48">
              <DropdownMenuItem className="hover:bg-gray-50 rounded-sm cursor-pointer">My Profile</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 rounded-sm cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-50 rounded-sm text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="default" 
            onClick={() => navigate('/login')}
            className="bg-airport-primary hover:bg-airport-primary/90 transition-all shadow-sm"
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
