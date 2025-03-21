import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, MessageSquare, Settings, BarChart, Users, LogOut, Loader2 } from "lucide-react";
import { BlinkBlur } from "react-loading-indicators"
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DashboardDataProvider, useDashboardDataContext } from "@/contexts/DashboardDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";

// Loading spinner component
const LoadingSpinner = () => {
  const { theme } = useTheme();
  const color = theme === 'dark' ? '#2f4ff5' : '#32cd32';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <BlinkBlur color='#2f4ff5' size="medium" text="" textColor="" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    </div>
  );
};

// Error message component
const ErrorDisplay = ({ error, onRetry }) => (
  <Card className="mx-auto max-w-md mt-8">
    <CardContent className="pt-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium">Failed to load dashboard data</h3>
        <p className="text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={onRetry}>
          Retry
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Dashboard content component with loading and error states
const DashboardContent = () => {
  const { isLoading, isError, error, refetch } = useDashboardDataContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = React.useState('');

  // Check for authentication on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication required");
      navigate("/login");
    }
    setUsername(localStorage.getItem("username"));
  }, [navigate]);

  const mainMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart,
    },
    {
      title: "Conversations",
      url: "/dashboard/conversations",
      icon: MessageSquare,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem('token'); // Use the same key name that's used when storing the token
    localStorage.removeItem('username'); // Use the same key name that's used when storing the token
    localStorage.removeItem('_id'); // Use the same key name that's used when storing the token
    localStorage.removeItem('dashboardData')
    
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (isError) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <div style={{gap:"10px"}} className="flex items-center gap-8 mb-8 mr-4">
                <Avatar className="border-2 border-sidebar-primary">
                  <div className="bg-salon-100 flex items-center justify-center text-salon-800 font-semibold h-full w-full">
                    {username ? username.slice(0, 2).toUpperCase() : 'SB'}
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm text-sidebar-primary">{username}</h3>
                  <p className="text-xs text-sidebar-foreground/80">Admin Panel</p>
                </div>
              </div>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/80">MAIN MENU</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        className={isActive(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                        onClick={() => navigate(item.url)}
                      >
                        <button>
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-4">
              <Separator className="my-4 bg-sidebar-border/30" />
              <div className="flex items-center gap-2 mb-4">
                <ThemeToggle />
                <span className="text-sidebar-foreground/80 text-xs">Toggle Theme</span>
              </div>
              <Button variant="outline" className="w-full bg-transparent border-sidebar-border/30 text-sidebar-foreground hover:bg-sidebar-border/30 hover:text-sidebar-foreground" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <SidebarTrigger className="md:hidden mr-4" />
            </div>
            <div className="md:flex items-center gap-4 hidden ml-auto">
              <Button variant="outline" size="sm" onClick={() => toast.info("Help documentation would open here")}>
                Help
              </Button>
            </div>
          </div>
          
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

// Main Dashboard component that wraps content with data provider
const Dashboard = () => {
  return (
    <DashboardDataProvider>
      <DashboardContent />
    </DashboardDataProvider>
  );
};

export default Dashboard;
