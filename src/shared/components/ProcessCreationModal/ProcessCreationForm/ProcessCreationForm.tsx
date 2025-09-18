import { Form, Input, message, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { useCreateProcessMutation } from "@store/api/processes/processesApi";
import { NodesCategoryEnum } from "@type/nodes";

type CreateProcessTrigger = ReturnType<typeof useCreateProcessMutation>[0];
interface ProcessFormProps {
  createProcess: CreateProcessTrigger;
  typesProcessData:
    | {
        data: IProcessType[];
      }
    | undefined;
  onSuccess: () => void;
}

type CategoryProps = { [key: string]: string };

const categoryNameLocal: CategoryProps = {
  [NodesCategoryEnum.Business_process]: "Бизнес-процесс",
  [NodesCategoryEnum.Agent]: "Агент",
};

export const ProcessCreationForm: FC<ProcessFormProps> = ({
  createProcess,
  onSuccess,
  typesProcessData,
}) => {
  const [form] = useForm();

  const typesProcess = typesProcessData?.data.map((item) => ({
    value: item.id,
    label: categoryNameLocal[item.name] ?? item.name,
  }));

  const { projectId } = useParams();

  const createProcessHandler = () => {
    form
      .validateFields()
      .then((values) => {
        const name = values["process-name"];
        const desc = values["process-desc"];
        const category_id = values["process-category"];
        const trigger_type = "never";

        createProcess({
          projectId: projectId!,
          name,
          desc,
          category_id,
          trigger_type,
        }).then((res) => {
          if (res.data) {
            onSuccess();
            message.success(`Процесс "${name}" создан!`);
          }
          if (res.error) {
            message.error("Ошибка при создании процесса!");
          }
        });
      })
      .catch(() => {
        message.error("Пожалуйста, заполните обязательные поля!");
      });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        createProcessHandler();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ "process-name": "", "process-desc": "" }}
    >
      <Form.Item
        name="process-name"
        label="Название"
        rules={[
          {
            required: true,
            message: "Пожалуйста, введите название процесса!",
          },
        ]}
      >
        <Input autoFocus />
      </Form.Item>
      <Form.Item
        name="process-category"
        label="Тип"
        rules={[
          {
            required: true,
            message: "Пожалуйста, введите выберите тип процесса!",
          },
        ]}
      >
        <Select options={typesProcess} />
      </Form.Item>
      <Form.Item
        name="process-desc"
        label="Описание"
        rules={[
          {
            required: true,
            message: "Пожалуйста, введите описание процесса!",
          },
        ]}
      >
        <Input.TextArea autoFocus />
      </Form.Item>
    </Form>
  );
};
