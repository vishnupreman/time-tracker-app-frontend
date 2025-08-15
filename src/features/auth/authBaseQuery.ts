import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import { setCredentials, logout } from "./authSlice";

const baseUrl = 'https://time-tracker-app-backend-1.onrender.com/api'
// const baseUrl = 'http://localhost:5000/api'

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let accessToken = (api.getState() as RootState).auth.accessToken;

    const baseQuery = fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers) => {
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        return headers;
      },
      credentials: "include",
    });

    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 403) {
      const refreshResult = await baseQuery("/auth/refresh-token", api, extraOptions);
      if (refreshResult.data) {
        const newAccessToken = (refreshResult.data as any).accessToken;
        api.dispatch(setCredentials({ accessToken: newAccessToken, user: (api.getState() as RootState).auth.user! }));
        accessToken = newAccessToken;
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }

    return result;
  };
