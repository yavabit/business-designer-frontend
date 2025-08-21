import {
  Avatar,
  Card,
  Flex,
  Modal,
  Radio,
  Select,
  type RadioChangeEvent,
} from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@hooks/storeHooks";
import {
  deleteProcess,
  fetchProcesses,
  setProcessCreationModal,
  type IFilter,
} from "@store/process/processSlice";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { ItemsPageLayout } from "@app/layouts/ItemsPageLayout/ItemsPageLayout";

const { Meta } = Card;


const optionsSortField = [
  {
    value: "name",
    label: "Название",
  },
  {
    value: "created_at",
    label: "Дата создания",
  },
  {
    value: "updated_at",
    label: "Дата модификации",
  },
  {
    value: "author_name",
    label: "Автор",
  },
];

const optionsOrderBy: CheckboxGroupProps<string>["options"] = [
  { label: "Убыванию", value: "desc" },
  { label: "Возрастанию", value: "asc" },
];

export const Processes = () => {
  const [filters, setFilters] = useState<IFilter>({
    search: "",
    sortField: "name",
    order: "asc",
    orderCreatedDate: "desc",
  });

  const { listProcesses, isLoading } = useAppSelector((state) => state.process);
  const [modal, contextHolder] = Modal.useModal();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { projectId } = useParams();

  const computedListProcesses = useMemo(() => {
    console.log(filters);
    const processes = listProcesses.filter((item) =>
      item.name
        .trim()
        .toLocaleLowerCase()
        .includes(filters.search.trim().toLocaleLowerCase())
    );

    processes.sort((a, b) => {
      if (filters.order === "desc") return -a[filters.sortField].localeCompare(b[filters.sortField]);
      else return a[filters.sortField].localeCompare(b[filters.sortField]);
    });

    // processes.sort((a, b) => {
    //   if (filters.order === "desc")
    //     return (
    //       new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    //     );
    //   else
    //     return (
    //       new Date(a.created_at).getTime() + new Date(b.created_at).getTime()
    //     );
    // });

    return processes;
  }, [listProcesses, filters]);

  const onSearch = (value: string) => {
    setFilters({
      ...filters,
      search: value,
    });
  };

  const handleClickDeleteProcess = (
    e: React.MouseEvent<SVGElement>,
    item: IProcess
  ) => {
    e.stopPropagation();
    modal.confirm({
      title: "Подтверждение",
      content: "Удалить процесс?",
      okText: "Да",
      cancelText: "Нет",
      onOk() {
        dispatch(deleteProcess(item));
      },
    });
  };

  useEffect(() => {
    dispatch(
      fetchProcesses({
        ...filters,
        projectId: Number(projectId),
      })
    );
  }, [navigate, dispatch, projectId]);

  const renderProcess = () => {
    return computedListProcesses.map((item) => (
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
            onClick={(e) => handleClickDeleteProcess(e, item)}
          />,
          <AiOutlineEdit key="edit" />,
        ]}
        hoverable
        onClick={() => navigate(`/process/${item.id}`)}
      >
        <Meta
          avatar={
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=6" />
          }
          title={item.name}
          description={item.desc}
        />
      </Card>
    ));
  };

  const onChangeSortField = (value: keyof IProcess) => {
    setFilters({
      ...filters,
			sortField: value
    });
  };

  const handleChangeOrder = (e: RadioChangeEvent, prop: string) => {
    setFilters({
      ...filters,
      [prop]: e.target.value,
    });
  };

  return (
    <ItemsPageLayout
      title="Процессы"
      action={() => dispatch(setProcessCreationModal(true))}
      searchAction={(value: string) => onSearch(value)}
    >
      <Flex gap="middle" vertical justify="space-evenly">
        <Flex gap="small" vertical style={{ textAlign: "left", width: 540 }}>
          <Flex justify="flex-start" gap="small" align="center">
            <div style={{ width: 230 }}>Поле выбора для сортировки:</div>
            <Select
              placeholder="Выберите значение"
              optionFilterProp="label"
              options={optionsSortField}
              style={{ width: 300 }}
							defaultValue={filters.sortField}
							value={filters.sortField}
              onChange={onChangeSortField}
            />
          </Flex>
          <Flex justify="flex-start" gap="small" align="center">
            <div style={{ width: 230 }}>Порядок сортировки:</div>
            <Radio.Group
              block
              options={optionsOrderBy}
              defaultValue={filters.order}
              value={filters.order}
              optionType="button"
              buttonStyle="solid"
              onChange={(e: RadioChangeEvent) => handleChangeOrder(e, "order")}
            />
          </Flex>
          <Flex justify="flex-start" gap="small" align="center">
            <div style={{ width: 230 }}>Дата создания по:</div>
            <Radio.Group
              block
              options={optionsOrderBy}
              defaultValue={filters.orderCreatedDate}
              value={filters.orderCreatedDate}
              optionType="button"
              buttonStyle="solid"
              onChange={(e: RadioChangeEvent) =>
                handleChangeOrder(e, "orderCreatedDate")
              }
            />
          </Flex>
        </Flex>
        <Flex wrap gap="small">
          {renderProcess()}
          {contextHolder}
        </Flex>
      </Flex>
    </ItemsPageLayout>
  );
};
