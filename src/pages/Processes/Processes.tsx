import { Avatar, Button, Card, Flex, Image, Spin } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useCallback, useEffect, useState, type FC } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { BsChevronLeft } from "react-icons/bs";

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

    const [getProcesses, { isLoading, isFetching, isError }] =
        useLazyGetProcessesQuery();

    const [deleteProcess] = useDeleteProcessMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const project = location.state.metadata;

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
        [getProcesses, searchString, sortField, sortOrder, projectId]
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
            title={
                <Flex align="center" gap={16}>
                    {!!project && (
                        <Button 
                            onClick={() => navigate('/')}
                        >
                            <BsChevronLeft />
                        </Button>
                    )}
                    <>Процессы {project}</>
                </Flex>}
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

                {isError && (
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
                    !isError &&
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
                    !isError &&
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
                                cover={
                                    <Image
                                        alt="Изображение процесса"
                                        height={250}
                                        width={300}
                                        src={item.pict_url ?? undefined}
                                        fallback="data:image/png;base64,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"
                                    />
                                }
                                actions={[
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id, item.name);
                                        }}>
                                        <AiOutlineDelete key="ellipsis" />
                                    </div>,
                                    <div
                                        onClick={() =>
                                            navigate(`/process/${item.id}`,{
                                                state: {
                                                    metadata: item.project_id ?? ""
                                                }
                                            })
                                        }>
                                        <AiOutlineEdit key="edit" />
                                    </div>,
                                ]}
                                hoverable>
                                <Meta
                                    avatar={
                                        <Avatar
                                            style={{
                                                backgroundColor: "#fde3cf",
                                                color: "#f56a00",
                                            }}>
                                            {item.author_name.at(0)}
                                        </Avatar>
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

                {!hasMore && allProcesses.length > 0 && currentPage > 1 &&  (
                    <Flex
                        justify="center"
                        style={{ padding: "20px", color: "#666" }}>
                        <p>
                            Все процессы загружены
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
