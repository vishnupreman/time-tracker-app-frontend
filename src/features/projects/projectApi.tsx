import { createApi,} from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/authBaseQuery';

export interface Project {
  _id: string;
  name: string;
  description?: string;
  userId: string;
}


export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: baseQueryWithReauth, // ← use this instead
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => '/projects/getProject',
      providesTags: ['Projects'],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({
        url: '/projects/createProject',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: builder.mutation<Project, { id: string; body: Partial<Project> }>({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;