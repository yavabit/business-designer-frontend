import { Avatar, Button, Card, Tooltip, Flex, Input, Form } from "antd";
import styles from "./Profile.module.scss";
import { AiFillEdit } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";

type FieldsType = {
	name: string;
	email: string;
};

export const Profile = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [editable, setEditable] = useState(false);
	const [form] = Form.useForm<FieldsType>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Получаем целевой элемент клика
      const target = event.target as HTMLElement;
      
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        target.tagName !== 'INPUT' &&
        !target.closest('button[aria-label="Редактировать профиль"]')
      ) {
        setEditable(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

	const handleFormChange = (changedValues: FieldsType) => {
		console.log(changedValues);
	};

	return (
		<section className={styles.profile} ref={containerRef}>
			<div className={styles["left-panel"]}>
				<Avatar shape="square" size={250} />
				<Tooltip title="Редактировать профиль" placement="bottom">
					<Button
						icon={<AiFillEdit />}
						onClick={() => setEditable(!editable)}
					/>
				</Tooltip>
			</div>
			<div className={styles["right-panel"]}>
				<Card title="Профиль">
					<Form
						form={form}
						name="profile-form"
						onValuesChange={handleFormChange}
					>
						<Flex vertical gap={12}>
							<Form.Item name="name">
								<Input
									placeholder="Имя"
									variant={!editable ? "borderless" : undefined}
									defaultValue={"Name Naming Nameoff"}
									disabled={!editable}
									onBlur={() => setEditable(false)}
								/>
							</Form.Item>
						</Flex>
						<Flex vertical gap={12}>
							<Form.Item name="email">
								<Input
									placeholder="email"
									variant={!editable ? "borderless" : undefined}
									type="email"
									defaultValue={"namenaming@gmail.com"}
									disabled={!editable}
									onBlur={() => setEditable(false)}
								/>
							</Form.Item>
						</Flex>
					</Form>
				</Card>
			</div>
		</section>
	);
};
