// features/tasks/taskApi.ts
import { createApi,} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from '../auth/authBaseQuery';

export interface Task {
  _id: string;
  name: string;
  description?: string;
  status: "pending" | "done";
  projectId: { _id: string; name: string };
}

export interface TaskRequest {
  name: string;
  description?: string;
  status: "pending" | "done";
  projectId: string; 
}

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Tasks"],
endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks/getTasks",
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation<Task, TaskRequest>({
      query: (body) => ({
        url: "/tasks/createTask",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation<Task, { id: string; body: TaskRequest }>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
