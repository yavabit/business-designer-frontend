import { useEffect, useMemo, useState, type FC } from "react";
import style from "./ConstructorHeader.module.scss";
import { Avatar, Button, Flex, Input, Select } from "antd";
import { BsChevronLeft, BsFillPlayFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@hooks/useTheme";
import { useLazyGetTriggerTypesQuery } from "@store/api/processes/processesApi";
import useSocket from "@hooks/useSocket";
import UserAvatar from "@components/UserAvatar/UserAvatar";
import { AiOutlineEdit } from "react-icons/ai";
import { socket } from "@store/api/socket";
import { useAppSelector } from "@hooks/storeHooks";

enum triggers {
  "never" = "Никогда",
  "periodically" = "Периодично",
}

export const ConstructorHeader: FC<{
  processData: IProcess;
  isAgent?: boolean;
}> = ({ processData, isAgent = false }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [getTriggers, triggersData] = useLazyGetTriggerTypesQuery();

  const { listJoinedUsers, emitDocumentNameUpdated } = useSocket();

  const [isEditProcessName, setEditProcessName] = useState(false);

  const [processName, setProcessName] = useState(processData.name);

  const curUserId = useAppSelector((state) => state.user.id);
  const isAuthor = processData.author_id === curUserId;

  useEffect(() => {
    if (isAgent) {
      getTriggers();
    }
  }, [isAgent, getTriggers]);

  const onDocumentNameUpdated = ({ name }: { name: string }) => {
    setProcessName(name);
  };

  useEffect(() => {
    socket.on("document-name-updated", onDocumentNameUpdated);

    return () => {
      socket.off("document-name-updated", onDocumentNameUpdated);
    };
  });

  const renderAvatars = useMemo(
    () =>
      Object.values(listJoinedUsers).map((item) => (
        <UserAvatar key={item.userId} label={item.username} />
      )),
    [listJoinedUsers]
  );

  const handleToggleEditProcessName = (val: boolean) => {
    if (isAuthor) return;

    setEditProcessName(val);
  };

  const handleChangeProcessName = (e: React.InputEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;

    if (!processData.id || name.trim().length == 0) return;

    emitDocumentNameUpdated({
      processId: processData.id,
      name,
    });

    setProcessName(name);
  };

  const renderProcessName = useMemo(() => {
    const name =
      processName.trim().length === 0
        ? "Введите название процесса"
        : processName;

    if (isAuthor && isEditProcessName) {
      return (
        <Flex gap={16}>
          <Input
            placeholder="Наименование"
            variant="underlined"
            value={processName}
            style={{
              width: 300,
            }}
            onInput={handleChangeProcessName}
          />
          <Button onClick={() => handleToggleEditProcessName(false)}>
            <AiOutlineEdit />
          </Button>
        </Flex>
      );
    }

    return (
      <Flex
        style={{
          width: 300,
        }}
        onDoubleClick={() => handleToggleEditProcessName(true)}
      >
        {name}
      </Flex>
    );
  }, [isEditProcessName, processName]);

  return (
    <Flex
      justify="space-between"
      align="center"
      className={`${style["process-bar"]} ${
        isDarkMode ? style["bar-dark"] : ""
      }`}
    >
      <Flex align="center" gap={16}>
        <Button onClick={() => navigate(-1)}>
          <BsChevronLeft />
        </Button>
        <div>{renderProcessName}</div>
      </Flex>

      <Flex gap={16}>
        <Flex align="center" gap={16}>
          <Avatar.Group>{renderAvatars}</Avatar.Group>
        </Flex>
        {isAgent && (
          <Flex gap={12} align="center">
            <Flex align="center" gap={8}>
              <p>Запускать:</p>
              <Select
                style={{ width: "150px" }}
                options={triggersData.data?.data.map((t) => ({
                  value: t.id,
                  label: triggers[t.name as keyof typeof triggers],
                }))}
                placeholder="Не выбрано"
              />
            </Flex>
            <Button color="green" variant="solid" title="Запустить процесс">
              <BsFillPlayFill size={24} />
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
