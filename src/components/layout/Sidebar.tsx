
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  LogOut,
  CheckSquare,
  TrendingUp
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
  return (
    <SidebarComponent>
      <SidebarHeader className="py-4">
        <div className="px-3 flex items-center gap-2">
          <div className="size-8 rounded-full airport-gradient flex items-center justify-center">
            <TrendingUp className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-lg">SkyHub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/price-prediction">
                  <TrendingUp className="h-4 w-4" />
                  <span>Flight Price Prediction</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/gates">
                  <Clock className="h-4 w-4" />
                  <span>Gate Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/check-in">
                  <CheckSquare className="h-4 w-4" />
                  <span>Web Check-In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/schedule">
                  <CalendarDays className="h-4 w-4" />
                  <span>Schedule</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/reports">
                  <BarChart3 className="h-4 w-4" />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/logout">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-3 mt-4">
          <SidebarTrigger className="w-full" />
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
