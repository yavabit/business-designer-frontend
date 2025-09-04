import { baseApi } from "../api";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ICredentials, {email: string, password: string}>({
            query: (body) => ({
                url: `/auth/login`,
                method: "POST",
                body
            })
        }),

        getProfile: builder.query<boolean, void>({
            query: () => ({
                url: `/users/profile`,
                method: "GET",
            }),
        }),

        getUserById: builder.query<boolean, string>({
            query: (id) => ({
                url: `/users/${id}`
            })
        })
    }),
});

export const { useLoginMutation } = usersApi