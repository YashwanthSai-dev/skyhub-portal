
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  LogOut,
  CheckSquare,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { 
  Sidebar as SidebarComponent,
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <SidebarComponent className="border-r border-gray-100">
      <SidebarHeader className="py-5">
        <div className="px-3 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-airport-primary to-airport-secondary flex items-center justify-center shadow-sm">
            <TrendingUp className="text-white h-5 w-5" />
          </div>
          <span className="font-semibold text-xl tracking-tight">SkyHub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className={isActive('/') ? 'bg-gray-100 text-airport-primary' : ''}>
                <Link to="/" className="transition-all duration-200 hover:translate-x-1">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className={isActive('/price-prediction') ? 'bg-gray-100 text-airport-primary' : ''}>
                <Link to="/price-prediction" className="transition-all duration-200 hover:translate-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Price Prediction</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className={isActive('/chatbot') ? 'bg-gray-100 text-airport-primary' : ''}>
                <Link to="/chatbot" className="transition-all duration-200 hover:translate-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>Chatbot</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className={isActive('/check-in') ? 'bg-gray-100 text-airport-primary' : ''}>
                <Link to="/check-in" className="transition-all duration-200 hover:translate-x-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>Web Check-In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className={isActive('/schedule') ? 'bg-gray-100 text-airport-primary' : ''}>
                <Link to="/schedule" className="transition-all duration-200 hover:translate-x-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Schedule</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className={isActive('/report') || isActive('/reports') ? 'bg-gray-100 text-airport-primary' : ''}>
                <Link to="/reports" className="transition-all duration-200 hover:translate-x-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4 border-t border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/logout" className="text-gray-600 transition-all duration-200 hover:translate-x-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-3 mt-6">
          <SidebarTrigger className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors" />
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
