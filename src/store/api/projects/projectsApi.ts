import { baseApi } from "../api";
import { apiTags } from "../apiTags";

export const projectsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<{ data: IProject[] }, void>({
            query: () => "/projects",
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
            async onQueryStarted(newName, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    projectsApi.util.updateQueryData(
                        "getProjects",
                        undefined,
                        (draft) => {
                            const tempId = `temp-${Date.now()}`;
                            draft.data.push({
                                id: tempId,
                                name: newName,
                                author_id: "1",
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                            });
                        }
                    )
                );

                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        projectsApi.util.updateQueryData(
                            "getProjects",
                            undefined,
                            (draft) => {
                                const index = draft.data.findIndex(
                                    (item) => item.id === `temp-${Date.now()}`
                                );
                                if (index !== -1) {
                                    draft.data[index] = data.data;
                                }
                            }
                        )
                    );
                } catch {
                    patchResult.undo();
                }
            },
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
            async onQueryStarted({ id, name }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    projectsApi.util.updateQueryData(
                        "getProjects",
                        undefined,
                        (draft) => {
                            const project = draft.data.find(
                                (item) => item.id === String(id)
                            );
                            if (project) {
                                project.name = name;
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: apiTags.projects, id },
            ],
        }),

        updateProjectData: builder.mutation<{message: string}, {id: string, data: FormData}>({
            query: (body) => ({
                url: `/projects/${body.id}/data`,
                method: 'PATCH',
                body: body.data,
                headers: {}
            }),
            async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
                const name = data.get('name') as string;
                
                // Оптимистичное обновление только имени
                const patchResult = dispatch(
                    projectsApi.util.updateQueryData(
                        "getProjects",
                        undefined,
                        (draft) => {
                            const project = draft.data.find(
                                (item) => item.id === String(id)
                            );
                            if (project) {
                                project.name = name;
                                project.updated_at = new Date().toISOString();
                            }
                        }
                    )
                );
        
                try {
                    await queryFulfilled;
                    dispatch(projectsApi.util.invalidateTags([{ type: apiTags.projects, id }]));
                    
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: apiTags.projects, id },
            ],
        }),

        deleteProject: builder.mutation<void, string>({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    projectsApi.util.updateQueryData(
                        "getProjects",
                        undefined,
                        (draft) => {
                            draft.data = draft.data.filter(
                                (item) => item.id !== String(id)
                            );
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
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
