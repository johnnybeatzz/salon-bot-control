import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchAllDashboardData, fetchDashboardStats, fetchChartData, fetchRecentActivity } from '@/lib/api';

// Custom hook for fetching all dashboard data at once
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchAllDashboardData,
    // Keep data fresh - refetch when window regains focus or when component remounts
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    // Cache data for 5 minutes
    staleTime: 1000 * 60 * 5,
  });
}

// Alternative hook that loads individual data pieces separately
// This can be useful if different components need different pieces of the data
export function useIndividualDashboardData() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['chartData'],
        queryFn: fetchChartData,
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['recentActivity'],
        queryFn: fetchRecentActivity,
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const [statsQuery, chartDataQuery, activityQuery] = queries;
  
  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const error = queries.find(query => query.error)?.error;

  return {
    isLoading,
    isError,
    error,
    stats: statsQuery.data?.stats,
    chartData: chartDataQuery.data,
    recentActivity: activityQuery.data,
  };
} 