import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiTags } from "./apiTags";
import type { RootState } from "..";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import { reset, setCredentials, setLoading } from "@store/user/userSlice";

export const baseUrl =
    import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const url = (getState() as RootState).api?.queries?.[
            Object.keys((getState() as RootState).api.queries)[0]
        ]?.endpointName;
        if (url && ["login", "register", "refresh"].includes(url)) {
            return headers;
        }

        const token = (getState() as RootState).user.token;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn = async (
    args: string | FetchArgs,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions) ;

    if (result?.error?.status === 401) {
        console.log("Token expired, attempting refresh...");
        api.dispatch(setLoading(true));

        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh",
                credentials: "include",
            },
            api,
            extraOptions
        );

        if (refreshResult?.data) {
            const refreshData = refreshResult.data as ICredentials;

            if (refreshData.accessToken) {
                api.dispatch(
                    setCredentials({
                        id: refreshData.data.id,
                        email: refreshData.data.email,
						accessToken: refreshData.accessToken
                    })
                );

                result = await baseQuery(args, api, extraOptions);
            }
        } else {
            api.dispatch(reset());
            api.dispatch(setLoading(false));
            window.location.replace("/login");
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: Object.values(apiTags),
    endpoints: () => ({}),
});
