import { baseApi } from "../api";
import { apiTags } from "../apiTags";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<
            ICredentials,
            {
                email: string;
                password: string;
                firstname: string;
                lastname: string;
            }
        >({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
        }),

        login: builder.mutation<
            ICredentials,
            { email: string; password: string }
        >({
            query: (body) => ({
                url: `/auth/login`,
                method: "POST",
                body,
            }),
        }),

        refresh: builder.query<ICredentials, void>({
            query: () => ({
                url: "/auth/refresh",
            }),
        }),

        checkAuth: builder.query<ICredentials, void>({
            query: () => ({
                url: "/auth/check"
            }),
        }),

        getProfile: builder.query<{data: Omit<IUser, 'isAuth'>  & { projects_count: number; }}, void>({
            query: () => ({
                url: `/users/profile`,
                method: "GET",
            }),
            providesTags: [apiTags.profile]
        }),

        updateProfileLow: builder.mutation<{name: string, email: string}, {name: string, email: string}>({
            query: (body) => ({
                url: `/users/profile-low`,
                method: "PATCH",
                body
            }),
            invalidatesTags: [apiTags.profile]
        }),

        getUserById: builder.query<{data: Omit<IUser, 'isAuth'>  & { projects_count: number; }}, string>({
            query: (id) => ({
                url: `/users/${id}`,
            }),
        }),

        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useLazyRefreshQuery,
    useLazyGetProfileQuery,
    useRegisterMutation,
    useUpdateProfileLowMutation,
    useLazyCheckAuthQuery,
} = usersApi;
