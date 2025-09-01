import type { RootState } from "@store/index";
import { setProcessCreationModal } from "@store/process/processSlice";
import { Button, Modal } from "antd";
import { type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateProcessMutation } from "@store/api/processes/processesApi";
import { ProcessCreationForm } from "./ProcessCreationForm/ProcessCreationForm";

export const ProcessCreationModal: FC = () => {
    const isOpen = useSelector(
        (state: RootState) => state.process.isCreationModalOpen
    );

    const [createProcess, { isLoading }] = useCreateProcessMutation();
    const dispatch = useDispatch();

    const handleCancel = () => {
        dispatch(setProcessCreationModal(false));
    };

    const handleSuccess = () => {
        dispatch(setProcessCreationModal(false));
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            open={true}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    onClick={() => {
                        const event = new KeyboardEvent("keydown", {
                            key: "Enter",
                            bubbles: true,
                        });
                        document.dispatchEvent(event);
                    }}>
                    Создать
                </Button>,
            ]}>
            <ProcessCreationForm
                createProcess={createProcess}
                onSuccess={handleSuccess}
            />
        </Modal>
    );
};
