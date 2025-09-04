import { baseApi } from "@store/api/api";
import { apiTags } from "@store/api/apiTags";

export const processConstructorApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getProcess: builder.query<
			{ data: IProcess },
			{ processId: string | undefined; }
		>({
			query: (params) => {
				const { processId } = params
				return {
					url: `/documents/${processId}`
				};
			},
			providesTags: (result) =>
				result
					? [{ type: apiTags.process, id: result.data.id }]
					: [{ type: apiTags.process, id: 'LIST' }],

		})
	})
})

export const { useGetProcessQuery } = processConstructorApi