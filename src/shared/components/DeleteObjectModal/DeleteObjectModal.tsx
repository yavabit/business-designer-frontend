import { Flex, Modal } from 'antd';
import { type FC, type ReactNode } from 'react';
import { BsExclamationCircleFill } from "react-icons/bs";

export const DeleteObjectModal: FC<{
    isOpen?: boolean;
    title: ReactNode; 
    content: ReactNode;
    onOk?: () => void;
    onCancel?: () => void;
}> = ({
    isOpen = false,
    title, 
    content,
    onOk,
    onCancel,
}) => {
  return (
    <Modal 
        open={isOpen}
        title={
            <Flex gap={12} align='center'>
                <BsExclamationCircleFill size={24} color='orange'/>
                {title}
            </Flex>}
        okText={'Удалить'}
        cancelText={'Отмена'}
        onOk={onOk}
        onCancel={onCancel}
    >   
        {content}
    </Modal>
  )
}

