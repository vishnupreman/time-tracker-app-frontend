// src/features/timeEntry/timeEntryApi.ts
import { createApi} from '@reduxjs/toolkit/query/react';
export interface ITimeEntry {
  _id: string;
  userId: string;      // ObjectId as string
  projectId: string;   // ObjectId as string
  taskId: string;      // ObjectId as string
  startTime: string;   // ISO date string
  endTime?: string;    // optional, ISO date string
  duration?: number;   // in minutes, optional
  isRunning: boolean;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}

import { baseQueryWithReauth } from '../auth/authBaseQuery';
export const timeEntryApi = createApi({
  reducerPath: 'timeEntryApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEntries: builder.query<ITimeEntry[], { projectId?: string; taskId?: string; date?: string }>({
      query: (params) => ({ url: '/timer/', params }),
    }),
    startTimer: builder.mutation<ITimeEntry, { projectId: string; taskId: string }>({
      query: (body) => ({ url: '/timer/start', method: 'POST', body }),
    }),
    stopTimer: builder.mutation<ITimeEntry, void>({
      query: () => ({ url: '/timer/stop', method: 'POST' }),
    }),
    addManualEntry: builder.mutation<ITimeEntry, { projectId: string; taskId: string; startTime: string; endTime: string }>({
      query: (body) => ({ url: '/timer/manual', method: 'POST', body }),
    }),
    editEntry: builder.mutation<ITimeEntry, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/timer/${id}`, method: 'PATCH', body: data }),
    }),
    deleteEntry: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/timer/${id}`, method: 'DELETE' }),
    }),
  }),
});

export const {
  useGetEntriesQuery,
  useStartTimerMutation,
  useStopTimerMutation,
  useAddManualEntryMutation,
  useEditEntryMutation,
  useDeleteEntryMutation,
} = timeEntryApi;
