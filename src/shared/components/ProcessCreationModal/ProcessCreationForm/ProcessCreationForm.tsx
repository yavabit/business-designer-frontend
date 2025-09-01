import { Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { useCreateProcessMutation } from "@store/api/processes/processesApi";

type CreateProcessTrigger = ReturnType<typeof useCreateProcessMutation>[0]
interface ProcessFormProps {
    createProcess: CreateProcessTrigger
    onSuccess: () => void;
}

export const ProcessCreationForm: FC<ProcessFormProps> = ({
    createProcess,
    onSuccess,
}) => {
    const [form] = useForm();

    const { projectId } = useParams();

    const createProcessHandler = () => {
        form.validateFields()
            .then((values) => {
                const newName = values["process-name"];
                const newDesc = values["process-desc"];

                createProcess({
                    projectId: projectId!,
                    name: newName,
                    desc: newDesc,
                }).then((res) => {
                    if (res.data) {
                        onSuccess();
                        message.success(`Процесс "${newName}" создан!`);
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
            initialValues={{ "process-name": "", "process-desc": "" }}>
            <Form.Item
                name="process-name"
                label="Название процесса"
                rules={[
                    {
                        required: true,
                        message: "Пожалуйста, введите название процесса!",
                    },
                ]}>
                <Input autoFocus />
            </Form.Item>
            <Form.Item
                name="process-desc"
                label="Описание процесса"
                rules={[
                    {
                        required: true,
                        message: "Пожалуйста, введите описание процесса!",
                    },
                ]}>
                <Input.TextArea autoFocus />
            </Form.Item>
        </Form>
    );
};
