import { Avatar, Button, Card, Flex, Spin } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useCallback, useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ItemsPageLayout } from "@app/layouts/ItemsPageLayout/ItemsPageLayout";
import {
    useDeleteProcessMutation,
    useLazyGetProcessesQuery,
} from "@store/api/processes/processesApi";
import { useDebounce } from "@hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@store/index";
import { useInfiniteScroll } from "@hooks/useInfinityScroll";
import { setProcessCreationModal } from "@store/process/processSlice";

const { Meta } = Card;

export const Processes: FC = () => {
    const [searchString, setSearchString] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortField, setSortField] = useState<string>("updated_at");
    const [sortOrder, setSortOrder] = useState<string>("DESC");
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [allProcesses, setAllProcesses] = useState<IProcess[]>([]);
    const [previousModalState, setPreviousModalState] = useState(false);

    const debouncedSearchValue = useDebounce(searchValue, 500);

    const { projectId } = useParams();

    const [getProcesses, { isLoading, isFetching, error }] =
        useLazyGetProcessesQuery();

    const [deleteProcess] = useDeleteProcessMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isCreationModalOpen = useSelector(
        (state: RootState) => state.process.isCreationModalOpen
    );

    useEffect(() => {
        setSearchString(debouncedSearchValue);
    }, [debouncedSearchValue]);

    const loadPage = useCallback(
        async (page: number, reset: boolean = false) => {
            if (projectId) {
                const result = await getProcesses({
                    projectId,
                    page: page,
                    limit: 70,
                    search: searchString,
                    field: sortField,
                    order: sortOrder,
                });

                if (result.data) {
                    const newProcesses = result.data.data;
                    const pagination = result.data.pagination;

                    if (page === 1 || reset) {
                        setAllProcesses(newProcesses);
                    } else {
                        const uniqueNewProcess = newProcesses.filter(
                            (newProcess) =>
                                !allProcesses.some(
                                    (existing) => existing.id === newProcess.id
                                )
                        );
                        setAllProcesses((prev) => [
                            ...prev,
                            ...uniqueNewProcess,
                        ]);
                    }

                    const totalPages = pagination?.total_pages || 1;
                    setHasMore(page < totalPages);
                    setCurrentPage(page);
                }
            }
        },
        [
            getProcesses,
            searchString,
            sortField,
            sortOrder,
            projectId,
        ]
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

    const handleDelete = useCallback(
        async (id: string, name: string) => {
            const shouldDelete = window.confirm(`Удалить процесс "${name}"?`);
            if (shouldDelete) {
                try {
                    await deleteProcess(id).unwrap();
                    setAllProcesses((prev) =>
                        prev.filter((process) => process.id !== id)
                    );
                } catch (error) {
                    console.error("Ошибка при удалении процесса:", error);
                }
            }
        },
        [deleteProcess]
    );

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
        if (previousModalState && !isCreationModalOpen) {
            loadPage(1, true);
        }

        setPreviousModalState(isCreationModalOpen);
    }, [isCreationModalOpen, previousModalState, loadPage, searchString]);

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
            title="Процессы"
            action={() => dispatch(setProcessCreationModal(true))}
            searchAction={handleSearch}
            sortFieldAction={handleSortField}
            sortOrderAction={handleSortOrder}>
            <Flex gap="middle" vertical justify="space-evenly">
                {isLoading &&
                    currentPage === 1 &&
                    allProcesses.length === 0 && (
                        <Flex justify="center" style={{ padding: "20px" }}>
                            <Spin size="large" />
                        </Flex>
                    )}

                {error && (
                    <Flex
                        vertical
                        gap={12}
                        align="center"
                        style={{ padding: "20px" }}>
                        <p>Ошибка при загрузке процессов!</p>
                        <Button onClick={() => loadPage(1, true)}>
                            Попробовать снова
                        </Button>
                    </Flex>
                )}

                {!isLoading &&
                    !error &&
                    allProcesses.length === 0 &&
                    searchString === "" && (
                        <Flex
                            vertical
                            gap={12}
                            align="center"
                            style={{ padding: "20px" }}>
                            <p>Не создано ни одного процесса.</p>
                            <Button
                                onClick={() =>
                                    dispatch(setProcessCreationModal(true))
                                }>
                                Создать?
                            </Button>
                        </Flex>
                    )}

                {!isLoading &&
                    !error &&
                    allProcesses.length === 0 &&
                    searchString !== "" && (
                        <Flex
                            vertical
                            gap={12}
                            align="center"
                            style={{ padding: "20px" }}>
                            <p>Процессы не найдены.</p>
                        </Flex>
                    )}

                {allProcesses.length > 0 && (
                    <Flex wrap gap="small">
                        {allProcesses.map((item) => (
                            <Card
                                key={item.id}
                                loading={isLoading}
                                style={{ width: 300 }}
                                cover={
                                    <img
                                        alt="Изображение процесса"
                                        height={160}
                                        src={item.pict_url ?? undefined}
                                    />
                                }
                                actions={[
                                    <AiOutlineDelete
                                        key="ellipsis"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id, item.name);
                                        }}
                                    />,
                                    <AiOutlineEdit key="edit" />,
                                ]}
                                hoverable
                                onClick={() => navigate(`/process/${item.id}`)}>
                                <Meta
                                    avatar={
                                        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=6" />
                                    }
                                    title={item.name}
                                    description={item.desc}
                                />
                            </Card>
                        ))}
                    </Flex>
                )}

                {isFetching && currentPage > 1 && (
                    <Flex
                        justify="center"
                        style={{ padding: "20px" }}
                        ref={loadingRef}>
                        <Spin size="large" />
                    </Flex>
                )}

                {!hasMore && allProcesses.length > 0 && (
                    <Flex
                        justify="center"
                        style={{ padding: "20px", color: "#666" }}>
                        <p>
                            Все процессы загружены ({allProcesses.length} всего)
                        </p>
                    </Flex>
                )}

                {hasMore && !isFetching && allProcesses.length > 0 && (
                    <div ref={loadingRef} style={{ height: "1px" }} />
                )}
            </Flex>
        </ItemsPageLayout>
    );
};
