import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authBaseQuery";


interface User {
  id: string;
  username: string;
  email: string;
}
interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<
      AuthResponse,
      { username: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    getDashboard: builder.query<{ message: string; user: User }, void>({
      query: () => "/dashboard",
    }),
    logout:builder.mutation<void,void>({
        query:()=>({
          url:'/auth/logout',
          method:'POST'
        })
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetDashboardQuery ,useLogoutMutation} =
  authApi;
