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
  useUpdateTriggerTypeMutation,
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

interface IChangeAgent {
  content: {
    agent: {
      statusAgent: boolean;
      triggerType: TriggerNameType;
      period: number;
    };
  };
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

  const [isStartedAgent, setStartedAgent] = useState(processData.is_started);
  const [triggerType, setTriggerType] = useState<TriggerNameType>(
    processData.trigger_type
  );
  const [period, setPeriod] = useState(processData.period);

  const { listJoinedUsers, emitDocumentNameUpdated, emitDocumentRefresh } =
    useSocket();

  const [isEditProcessName, setEditProcessName] = useState(false);

  const [processName, setProcessName] = useState(processData.name);

  const curUserId = useAppSelector((state) => state.user.id);
  const isAuthor = useMemo(() => {
    return processData.author_id === curUserId;
  }, [processData, curUserId]);

  useEffect(() => {
    if (isAgent) {
      getTriggers();
    }
  }, [isAgent, getTriggers]);

  const getProcessTrigger = (triggerName: TriggerNameType) => {
    return triggersData.data?.data.find((t) => t.name == triggerName)?.id;
  };

  const isNeverTrigger = (triggerName: TriggerNameType) => {
    return (
      getProcessTrigger(triggerName) ==
      triggersData.data?.data.find((t) => t.name == "never")?.id
    );
  };

  const changeTriggerType = (trigger_type_id: string) => {
    const triggerObj = triggersData.data?.data.find(
      (t) => t.id == trigger_type_id
    );
    if (triggerObj) {
      if (triggerObj.name == "never") {
        updatePeriod({
          process: processData.id,
          period: null,
        });
        if (isStartedAgent) {
          switchShedule(processData.id);
        }
      }
      updateTrigger({
        process: processData.id,
        trigger_type: trigger_type_id,
      });

      const newTriggerType: TriggerNameType = triggerObj.name;

      setTriggerType(newTriggerType);

      emitDocumentRefresh({
        processId: processData.id.toString(),
        content: {
          agent: {
            triggerType: newTriggerType,
          },
        },
      });
    }
  };

  const renderAvatars = useMemo(
    () =>
      Object.values(listJoinedUsers).map((item) => (
        <UserAvatar key={item.userId} label={item.username} />
      )),
    [listJoinedUsers]
  );

  const handleToggleEditProcessName = (val: boolean) => {
    if (!isAuthor) return;

    setEditProcessName(val);
  };

  const handleChangeProcessName = (e: React.InputEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;

    if (!processData.id || name.trim().length == 0) return;

    emitDocumentNameUpdated({
      processId: processData.id.toString(),
      name,
    });

    setProcessName(name);
  };

  const onDocumentNameUpdated = ({ name }: { name: string }) => {
    setProcessName(name);
  };

  const onDocumentStatusAgent = (e: IChangeAgent) => {
    const { agent } = e.content;

    if ("statusAgent" in agent) setStartedAgent(agent.statusAgent);

    if ("triggerType" in agent) setTriggerType(agent.triggerType);

    if ("period" in agent) setPeriod(agent.period);
  };

  const handleClickStartStopButton = () => {
    switchShedule(processData.id);

    setStartedAgent(!isStartedAgent);

    emitDocumentRefresh({
      processId: processData.id.toString(),
      content: {
        agent: {
          statusAgent: !isStartedAgent,
        },
      },
    });
  };

  const handleChangePeriod = (val: number) => {
    updatePeriod({ process: processData.id, period: val });
		const newPerion = val
    setPeriod(newPerion);

    emitDocumentRefresh({
      processId: processData.id.toString(),
      content: {
        agent: {
          period: newPerion,
        },
      },
    });
  };

  useEffect(() => {
    socket.on("document-name-updated", onDocumentNameUpdated);
    socket.on("document-refresh", onDocumentStatusAgent);

    return () => {
      socket.off("document-name-updated", onDocumentNameUpdated);
      socket.on("document-refresh", onDocumentStatusAgent);
    };
  }, []);

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
  }, [isEditProcessName, processName, isAuthor, handleChangeProcessName]);

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
                value={getProcessTrigger(triggerType)}
                onChange={(val) => changeTriggerType(val)}
              />
            </Flex>
            <Flex align="center">
              <Select
                disabled={
                  !triggerType ||
                  triggersData.isLoading ||
                  updPeriodData.isLoading ||
                  isNeverTrigger(triggerType)
                }
                style={{ width: "150px" }}
                options={[
                  { value: 3600000, label: "Раз в час" },
                  { value: 86400000, label: "Раз в день" },
                  { value: 2592000000, label: "Раз в месяц" },
                ]}
                placeholder="Период"
                value={period ? Number(period) : undefined}
                onChange={(val) => {
                  handleChangePeriod(val);
                }}
              />
            </Flex>
            <Tooltip
              title={
                isStartedAgent ? (
                  <Flex vertical>
                    {!!processData.last_run_date && (
                      <p>
                        Дата последнего запуска:{" "}
                        {formatDate(processData.last_run_date)}
                      </p>
                    )}
                    {!!processData.next_run_date && (
                      <p>
                        Дата следующего запуска:{" "}
                        {formatDate(processData.next_run_date)}
                      </p>
                    )}
                    <p>Остановить агент?</p>
                  </Flex>
                ) : (
                  "Запустить процесс"
                )
              }
              placement="bottom"
            >
              <Button
                disabled={
                  !triggerType ||
                  !period ||
                  triggersData.isLoading ||
                  updTriggerData.isLoading ||
                  updPeriodData.isLoading ||
                  isNeverTrigger(triggerType) ||
                  sheduleData.isLoading
                }
                color={isStartedAgent ? "red" : "green"}
                variant="solid"
                onClick={handleClickStartStopButton}
              >
                {isStartedAgent ? (
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
