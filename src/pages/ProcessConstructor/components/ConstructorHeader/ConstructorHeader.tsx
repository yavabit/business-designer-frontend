import { useEffect, useMemo, useState, type FC } from "react";
import style from "./ConstructorHeader.module.scss";
import { Avatar, Button, Flex, Input, Select } from "antd";
import { BsChevronLeft, BsFillPlayFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@hooks/useTheme";
import { useLazyGetTriggerTypesQuery } from "@store/api/processes/processesApi";
import useSocket from "@hooks/useSocket";
import UserAvatar from "@components/UserAvatar/UserAvatar";

enum triggers {
  "never" = "Никогда",
  "periodically" = "Периодично",
}

export const ConstructorHeader: FC<{
  processName?: string;
  isAgent?: boolean;
}> = ({ processName, isAgent = false }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [getTriggers, triggersData] = useLazyGetTriggerTypesQuery();

  const { listJoinedUsers } = useSocket();

  const [isEditProcessName, setEditProcessName] = useState(false);

  useEffect(() => {
    if (isAgent) {
      getTriggers();
    }
  }, [isAgent, getTriggers]);

  const renderAvatars = useMemo(
    () =>
      Object.values(listJoinedUsers).map((item) => (
        <UserAvatar key={item.userId} label={item.username} />
      )),
    [listJoinedUsers]
  );

  const handleClickProcessName = () => {
    setEditProcessName(true);
  };

  const renderProcessName = useMemo(() => {
    if (isEditProcessName) {
      return (
        <span>
          <Input
            placeholder="Наименование"
            variant="underlined"
            defaultValue={processName}
          />
        </span>
      );
    }

    return <span onDoubleClick={handleClickProcessName}>{processName}</span>;
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
        <p>{renderProcessName}</p>
      </Flex>

      <Flex gap={16}>
        <Flex align="center" gap={16}>
          <Avatar.Group>
            {renderAvatars}
          </Avatar.Group>
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
