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

		}),
		updateProcessScheme: builder.mutation<
			{ data: IProcess },
			{ id: string, content: string }
		>({
			query: (body) => ({
				url: `/documents/${body.id}/content`,
				method: "PATCH",
				body: {
					content: body.content
				}
			}),
			invalidatesTags: [{ type: apiTags.process, id: "LIST" }],
		}),
		updateProcessImage: builder.mutation<
			{ data: IProcess },
			{ id: string, data: FormData }
		>({
			query: (body) => ({
				url: `/documents/${body.id}/picture`,
				method: "PATCH",
				body: body.data
			}),
			invalidatesTags: [{ type: apiTags.process, id: "LIST" }],
		}),
	})
})

export const { useLazyGetProcessQuery, useGetProcessQuery, useUpdateProcessSchemeMutation, useUpdateProcessImageMutation } = processConstructorApi