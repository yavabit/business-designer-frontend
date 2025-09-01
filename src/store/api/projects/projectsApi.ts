import { baseApi } from "../api";
import { apiTags } from "../apiTags";

export const projectsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<
            { pagination: IPagination; data: IProject[] },
            IGetAllParams
        >({
            query: (params = {}) => {
                const { limit = 50, page = 1, field, order, search } = params;
                return {
                    url: "/projects",
                    params: { limit, page, field, order, search },
                };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.map(({ id }) => ({
                              type: apiTags.projects,
                              id,
                          })),
                          { type: apiTags.projects, id: "LIST" },
                      ]
                    : [{ type: apiTags.projects, id: "LIST" }],
        }),

        createProject: builder.mutation<{ data: IProject }, string>({
            query: (newName) => ({
                url: "/projects",
                method: "POST",
                body: { name: newName },
            }),
            invalidatesTags: [{ type: apiTags.projects, id: "LIST" }],
        }),

        updateProjectName: builder.mutation<
            { data: IProject },
            { id: string; name: string }
        >({
            query: ({ id, name }) => ({
                url: `/projects/${id}/name`,
                method: "PATCH",
                body: { name },
            }),
            invalidatesTags: [{ type: apiTags.projects, id: "LIST" }],
        }),

        updateProjectData: builder.mutation<
            { message: string },
            { id: string; data: FormData }
        >({
            query: (body) => ({
                url: `/projects/${body.id}/data`,
                method: "PATCH",
                body: body.data,
                headers: {},
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: apiTags.projects, id },
            ],
        }),

        deleteProject: builder.mutation<void, string>({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: apiTags.projects, id },
            ],
        }),
    }),
});

export const {
    useLazyGetProjectsQuery,
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectNameMutation,
    useDeleteProjectMutation,
    useUpdateProjectDataMutation,
} = projectsApi;
