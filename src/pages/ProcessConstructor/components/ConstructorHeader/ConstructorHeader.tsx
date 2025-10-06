import { useEffect, useMemo, useState, type FC } from "react";
import style from "./ConstructorHeader.module.scss";
import { Avatar, Button, Flex, Input, Select, Tooltip } from "antd";
import { BsChevronLeft, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@hooks/useTheme";
import { useLazyGetTriggerTypesQuery } from "@store/api/processes/processesApi";
import { 
  useSwitchSheduleMutation, 
  useUpdatePeriodMutation, 
  useUpdateTriggerTypeMutation 
} from "@store/api/processConstructor/processConstructorApi";
import useSocket from "@hooks/useSocket";
import UserAvatar from "@components/UserAvatar/UserAvatar";
import { AiOutlineEdit } from "react-icons/ai";
import { socket } from "@store/api/socket";
import { useAppSelector } from "@hooks/storeHooks";
import { formatDate } from "@shared/utils/formatDate";

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
  const [updateTrigger, updTriggerData] = useUpdateTriggerTypeMutation();
  const [updatePeriod, updPeriodData] = useUpdatePeriodMutation();
  const [switchShedule, sheduleData] = useSwitchSheduleMutation();

  const { listJoinedUsers, emitDocumentNameUpdated } = useSocket();

  const [isEditProcessName, setEditProcessName] = useState(false);

  const [processName, setProcessName] = useState(processData.name);

  const curUserId = useAppSelector((state) => state.user.id);
  const isAuthor = processData.author_id === curUserId;

  useEffect(() => {
    if (isAgent) {
      getTriggers()
    }
  }, [isAgent, getTriggers]);

  const getProcessTrigger = (triggerName: "never" | "periodically" | null | undefined) => {
    return triggersData.data?.data.find(t => t.name == triggerName)?.id
  }

  const isNeverTrigger = (triggerName: "never" | "periodically" | null | undefined) => {
    return getProcessTrigger(triggerName) == triggersData.data?.data.find(t => t.name == 'never')?.id
  }

  const changeTriggerType = (trigger_type_id: string) => {
    const triggerObj = triggersData.data?.data.find(t => t.id == trigger_type_id)
    if (triggerObj) {
      if (triggerObj.name == 'never') {
        updatePeriod({
          process: processData.id, 
          period: null
        })
        if (processData.is_started) {
          switchShedule(processData.id)
        }
      }
      updateTrigger({
        process: processData.id, 
        trigger_type: trigger_type_id
      })
    }
  }

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
                disabled={triggersData.isLoading || updTriggerData.isLoading}
                style={{ width: "150px" }}
                options={triggersData.data?.data.map((t) => ({
                  value: t.id,
                  label: triggers[t.name as keyof typeof triggers],
                }))}
                placeholder="Не выбрано"
                value={getProcessTrigger(processData.trigger_type)}
                onChange={(val) => changeTriggerType(val)}
              />
            </Flex>
            <Flex align="center">
                <Select
                  disabled={
                    !processData.trigger_type || 
                    triggersData.isLoading ||
                    updPeriodData.isLoading || 
                    isNeverTrigger(processData.trigger_type)
                  }
                  style={{ width: "150px" }}
                  options={[
                    {value: 3600000, label: 'Раз в час'},
                    {value: 86400000, label: 'Раз в день'},
                    {value: 2592000000, label: 'Раз в месяц'},
                  ]}
                  placeholder="Период"
                  value={processData.period ? Number(processData.period) : undefined}
                  onChange={(val) => updatePeriod({process: processData.id, period: val})}
                />
            </Flex>
            <Tooltip
              title={ processData.is_started
                ? (
                  <Flex vertical>
                    {!!processData.last_run_date && (
                      <p>Дата последнего запуска: {formatDate(processData.last_run_date)}</p>
                    )}
                    {!!processData.next_run_date && (
                      <p>Дата следующего запуска: {formatDate(processData.next_run_date)}</p>
                    )}
                    <p>Остановить агент?</p>
                  </Flex>
                ) 
                : "Запустить процесс"
              }
              placement="bottom"
            >
              <Button
                disabled={
                  !processData.trigger_type || 
                  !processData.period || 
                  triggersData.isLoading ||
                  updTriggerData.isLoading ||
                  updPeriodData.isLoading ||
                  isNeverTrigger(processData.trigger_type) ||
                  sheduleData.isLoading
                } 
                color={processData.is_started ? "red" : "green"} 
                variant="solid" 
                onClick={() => switchShedule(processData.id)}>
                {processData.is_started ? (
                  <BsFillPauseFill size={24} />
                ) : (
                  <BsFillPlayFill size={24} />
                )}
              </Button>
            </Tooltip>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
