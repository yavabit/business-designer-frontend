import {
  Avatar,
  Card,
  Flex,
  Input,
  Modal,
  Radio,
  Select,
  type GetProps,
} from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@hooks/storeHooks";
import {
  deleteProcess,
  fetchProcesses,
  type IFilter,
} from "@store/process/processSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CheckboxGroupProps } from "antd/es/checkbox";

const { Meta } = Card;

const { Search } = Input;
type SearchProps = GetProps<typeof Input.Search>;

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
    value: "creation_user_name",
    label: "Автор",
  },
];

const optionsOrderBy: CheckboxGroupProps<string>["options"] = [
  { label: "Убыванию", value: "DESC" },
  { label: "Возрастанию", value: "ASC" },
];

export const Processes = () => {
  const [filters, setFilters] = useState<IFilter>({
    search: "",
    sortField: "name",
    orderCreatedDate: "desc",
    orderAlphabet: "",
  });

  const { listProcesses, isLoading } = useAppSelector((state) => state.process);
  const [modal, contextHolder] = Modal.useModal();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { projectId } = useParams();

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const handleClickDeleteProcess = (item: IProcess) => {
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
        projectId: Number(projectId),
      })
    );
  }, [navigate, dispatch, projectId]);

  const renderProcess = () => {
    return listProcesses.map((item) => (
      <Card
        key={item.id}
        loading={isLoading}
        style={{ width: 300 }}
        cover={
          <img alt="Изображение процесса" height={160} src={item.pict_url ?? undefined} />
        }
        actions={[
          <AiOutlineDelete
            key="ellipsis"
            onClick={() => handleClickDeleteProcess(item)}
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

  const onChangeSortField = () => {
    setFilters({
      ...filters,
    });
  };

  return (
    <Flex gap="middle" vertical>
      <Flex gap="small" vertical style={{ textAlign: "left", width: 540 }}>
        <Search
          placeholder="Поиск"
          onSearch={onSearch}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Flex justify="flex-start" gap="small" align="center">
          <div style={{ width: 230 }}>Поле выбора для сортировки:</div>
          <Select
            placeholder="Выберите значение"
            optionFilterProp="label"
            onChange={onChangeSortField}
            onSearch={onSearch}
            options={optionsSortField}
            style={{ width: 300 }}
          />
        </Flex>
        <Flex justify="flex-start" gap="small" align="center">
          <div style={{ width: 230 }}>Дата создания по:</div>
          <Radio.Group
            block
            options={optionsOrderBy}
            defaultValue="DESC"
            optionType="button"
            buttonStyle="solid"
          />
        </Flex>
        <Flex justify="flex-start" gap="small" align="center">
          <div style={{ width: 230 }}>Алфавитный порядок по:</div>
          <Radio.Group
            block
            options={optionsOrderBy}
            defaultValue="ASC"
            optionType="button"
            buttonStyle="solid"
          />
        </Flex>
      </Flex>
      <Flex wrap gap="small">
        {renderProcess()}
        {contextHolder}
      </Flex>
    </Flex>
  );
};
