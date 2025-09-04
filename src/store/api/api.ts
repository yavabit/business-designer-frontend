import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiTags } from "./apiTags";
import type { RootState } from "..";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { reset, setCredentials } from "@store/user/userSlice";

export const baseUrl = import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
	baseUrl: baseUrl,
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).user.token;
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
	let res = await baseQuery(args, api, extraOptions);
	if (res?.error) {
		console.log("Sending refreshToken...");
		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
		if (refreshResult?.data) {
			const email = (api.getState() as RootState).user.email;
			api.dispatch(
				setCredentials({
					...(refreshResult.data as ICredentials),
					email,
				})
			);
			res = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(reset());
			location.href = "/login"
		}
	}
	return res;
};

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: baseQueryWithReauth,
	// baseQuery: fetchBaseQuery({
	//     baseUrl: import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_URL,
	// }),
	tagTypes: Object.values(apiTags),
	endpoints: () => ({}),
});
