import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiTags } from './apiTags';

export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_URL,
	}),
	tagTypes: Object.values(apiTags),
	endpoints: () => ({}),
});