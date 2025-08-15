import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi"; 
import authReducer from "../features/auth/authSlice";
import { projectApi } from "../features/projects/projectApi"
import { taskApi } from "../features/task/taskApi";
import { timeEntryApi } from "../features/timer/timerApi";
import { dashboardApi } from "../features/dashboard/dashboardApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [projectApi.reducerPath]:projectApi.reducer,
    [taskApi.reducerPath]:taskApi.reducer,
    [timeEntryApi.reducerPath]:timeEntryApi.reducer,
    [dashboardApi.reducerPath]:dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,projectApi.middleware,taskApi.middleware,
      timeEntryApi.middleware,dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
