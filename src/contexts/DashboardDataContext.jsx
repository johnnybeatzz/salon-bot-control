import React, { createContext, useContext } from 'react';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Users, MessageCircle, Clock, AlertTriangle } from "lucide-react";

// Create context
const DashboardDataContext = createContext(null);

// Create provider component
export function DashboardDataProvider({ children }) {
  // Fetch dashboard data using our custom hook
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useDashboardData();
  
  // Map icon strings to actual components
  const mapIconToComponent = (iconName) => {
    const iconMap = {
      'Users': Users,
      'MessageCircle': MessageCircle,
      'Clock': Clock,
      'AlertTriangle': AlertTriangle
    };
    
    return iconMap[iconName] || Users;
  };
  
  // Process the data if it exists
  let processedData = null;
  
  if (data) {
    // Map string icon names to actual icon components
    processedData = {
      ...data,
      stats: data.stats.map(stat => ({
        ...stat,
        icon: mapIconToComponent(stat.icon)
      }))
    };
  }
  
  // Create value object for the context
  const value = {
    data: processedData,
    isLoading,
    isError,
    error,
    refetch
  };
  
  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

// Custom hook to use the dashboard context
export function useDashboardDataContext() {
  const context = useContext(DashboardDataContext);
  
  if (context === null) {
    throw new Error('useDashboardDataContext must be used within a DashboardDataProvider');
  }
  
  return context;
} 