// dashboardApi.ts
import { createApi} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from '../auth/authBaseQuery';

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProjectTotals: builder.query<any[], void>({
      query: () => "/dashboard/project-totals",
    }),
    getTaskTotals: builder.query<any[], { projectId?: string }>({
      query: ({ projectId }) => `/dashboard/task-totals${projectId ? `?projectId=${projectId}` : ""}`,
    }),
    getRecentEntries: builder.query<
      any[],
      { projectId?: string; limit?: number; date?: string }
    >({
      query: ({ projectId, limit = 10, date }) =>
        `/dashboard/recent-entries?${projectId ? `projectId=${projectId}&` : ""}${date ? `date=${date}&` : ""}limit=${limit}`,
    }),
    getSummary: builder.query<{ today: number; week: number }, void>({
      query: () => "/dashboard/summary",
    }),
    getWeeklyView: builder.query<any[], void>({
      query: () => "/dashboard/weekly-view",
    }),
  }),
});

export const {
  useGetProjectTotalsQuery,
  useGetTaskTotalsQuery,
  useGetRecentEntriesQuery,
  useGetSummaryQuery,
  useGetWeeklyViewQuery,
} = dashboardApi;
