import { useEffect, useState, useCallback, type FC } from "react";
import { ItemsPageLayout } from "@app/layouts/ItemsPageLayout/ItemsPageLayout";
import styles from "./Projects.module.scss";
import { ProjectItem } from "./components/ProjectItem/ProjectItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCreationModal, setEditModal } from "@store/projects/projectsSlice";
import {
    useDeleteProjectMutation,
    useUpdateProjectNameMutation,
    useLazyGetProjectsQuery,
} from "@store/api/projects/projectsApi";
import { Button, Flex, Spin } from "antd";
import { useInfiniteScroll } from "@hooks/useInfinityScroll";
import type { RootState } from "@store/index";
import { useDebounce } from "@hooks/useDebounce";

export const Projects: FC = () => {
    const [checked, setChecked] = useState<string | undefined>();
    const [editing, setEditing] = useState<string | undefined>();
    const [searchString, setSearchString] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortField, setSortField] = useState<string>("updated_at");
    const [sortOrder, setSortOrder] = useState<string>("DESC");
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [allProjects, setAllProjects] = useState<IProject[]>([]);

    const debouncedSearchValue = useDebounce(searchValue, 500);

    const [getProjects, { isLoading, isFetching, isError }] =
        useLazyGetProjectsQuery();

    const [updateProject] = useUpdateProjectNameMutation();
    const [deleteProject] = useDeleteProjectMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isCreationModalOpen = useSelector(
        (state: RootState) => state.projects.isCreationModalOpen
    );

    const isEditModalOpen = useSelector(
        (state: RootState) => state.projects.isEditModalOpen
    );

    useEffect(() => {
        setSearchString(debouncedSearchValue);
    }, [debouncedSearchValue]);

    const loadPage = useCallback(
        async (page: number, reset: boolean = false) => {
            const result = await getProjects({
                page: page,
                limit: 70,
                search: searchString,
                field: sortField,
                order: sortOrder,
            });

            if (result.data) {
                const newProjects = result.data.data;
                const pagination = result.data.pagination;

                if (page === 1 || reset) {
                    setAllProjects(newProjects);
                } else {
                    const uniqueNewProjects = newProjects.filter(
                        (newProject) =>
                            !allProjects.some(
                                (existing) => existing.id === newProject.id
                            )
                    );
                    setAllProjects((prev) => [...prev, ...uniqueNewProjects]);
                }

                const totalPages = pagination?.total_pages || 1;
                setHasMore(page < totalPages);
                setCurrentPage(page);
            }
        },
        [getProjects, searchString, sortField, sortOrder]
    );

    const loadNextPage = useCallback(() => {
        if (!hasMore || isFetching) return;
        loadPage(currentPage + 1);
    }, [hasMore, isFetching, currentPage, loadPage]);

    const loadingRef = useInfiniteScroll({
        onLoadMore: loadNextPage,
        hasMore,
        isLoading: isFetching,
        threshold: 0.1,
        rootMargin: "40% 0px",
    });

    useEffect(() => {
        loadPage(1);
    }, [loadPage]);

    useEffect(() => {
        loadPage(1, true);
    }, [searchString, loadPage]);

    useEffect(() => {
        loadPage(1, true);
    }, [sortField, sortOrder, loadPage]);

    useEffect(() => {
        if (!isCreationModalOpen) {
            loadPage(1, true);
        }

    }, [isCreationModalOpen, loadPage]);

    useEffect(() => {
        if (!isEditModalOpen) {
            loadPage(1, true);
        }

    }, [isEditModalOpen, loadPage]);

    const handleItemClick = useCallback((id: string | undefined) => {
        setChecked(id);
        if (id === undefined) {
            setEditing(undefined);
        }
    }, []);

    const handleItemDoubleClick = useCallback(
        (id: string) => {
            navigate(`/project/${id}`);
        },
        [navigate]
    );

    const handleStartEditing = useCallback((id: string) => {
        setEditing(id);
    }, []);

    const handleEndEditing = useCallback(
        async (id: string, newName: string) => {
            if (newName.trim()) {
                try {
                    await updateProject({ id, name: newName }).unwrap();
                    setAllProjects((prev) =>
                        prev.map((project) =>
                            project.id === id
                                ? {
                                      ...project,
                                      name: newName,
                                      updated_at: new Date().toISOString(),
                                  }
                                : project
                        )
                    );
                } catch (error) {
                    console.error("Ошибка при обновлении проекта:", error);
                }
            }
            setEditing(undefined);
        },
        [updateProject]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                await deleteProject(id).unwrap();
                setAllProjects((prev) =>
                    prev.filter((project) => project.id !== id)
                );
                if (checked === id) {
                    setChecked(undefined);
                }
            } catch (error) {
                console.error("Ошибка при удалении проекта:", error);
            }
        },
        [deleteProject, checked]
    );

    const handleGlobalEdit = useCallback(
        (projectId: string) => {
            dispatch(setEditModal({ modalState: true, projectId }));
        },
        [dispatch]
    );

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value);
        setCurrentPage(1);
    }, []);

    const handleSortField = useCallback((value: string) => {
        setSortField(value);
        setCurrentPage(1);
    }, []);

    const handleSortOrder = useCallback((value: string) => {
        setSortOrder(value);
        setCurrentPage(1);
    }, []);

    return (
        <ItemsPageLayout
            title="Мои проекты"
            action={() => dispatch(setCreationModal(true))}
            searchAction={handleSearch}
            sortFieldAction={handleSortField}
            sortOrderAction={handleSortOrder}>
            {isLoading && currentPage === 1 && allProjects.length === 0 && (
                <Flex justify="center" style={{ padding: "20px" }}>
                    <Spin size="large" />
                </Flex>
            )}

            {isError && (
                <Flex
                    vertical
                    gap={12}
                    align="center"
                    style={{ padding: "20px" }}>
                    <p>Ошибка при загрузке проектов!</p>
                    <Button onClick={() => loadPage(1, true)}>
                        Попробовать снова
                    </Button>
                </Flex>
            )}

            {!isLoading &&
                !isError &&
                allProjects.length === 0 &&
                searchString === "" && (
                    <Flex
                        vertical
                        gap={12}
                        align="center"
                        style={{ padding: "20px" }}>
                        <p>Не создано ни одного проекта.</p>
                        <Button
                            onClick={() => dispatch(setCreationModal(true))}>
                            Создать?
                        </Button>
                    </Flex>
                )}

            {!isLoading &&
                !isError &&
                allProjects.length === 0 &&
                searchString !== "" && (
                    <Flex
                        vertical
                        gap={12}
                        align="center"
                        style={{ padding: "20px" }}>
                        <p>Проекты не найдены.</p>
                    </Flex>
                )}

            {allProjects.length > 0 && (
                <div className={styles["folders-grid"]}>
                    {allProjects.map((p) => (
                        <div className={styles["grid-item"]} key={p.id}>
                            <ProjectItem
                                {...p}
                                checked={checked === p.id}
                                editing={editing === p.id}
                                onClick={handleItemClick}
                                onDoubleClick={handleItemDoubleClick}
                                onStartEditing={handleStartEditing}
                                onEndEditing={handleEndEditing}
                                onDelete={() => handleDelete(p.id)}
                                onGlobalEdit={() => handleGlobalEdit(p.id)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {isFetching && currentPage > 1 && (
                <Flex
                    justify="center"
                    style={{ padding: "20px" }}
                    ref={loadingRef}>
                    <Spin size="large" />
                </Flex>
            )}

            {!hasMore && allProjects.length > 0 && (
                <Flex
                    justify="center"
                    style={{ padding: "20px", color: "#666" }}>
                    <p>Все проекты загружены ({allProjects.length} всего)</p>
                </Flex>
            )}

            {hasMore && !isFetching && allProjects.length > 0 && (
                <div ref={loadingRef} style={{ height: "1px" }} />
            )}
        </ItemsPageLayout>
    );
};
