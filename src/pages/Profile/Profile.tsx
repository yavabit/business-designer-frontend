import {
    Avatar,
    Button,
    Card,
    Tooltip,
    Flex,
    Input,
    Form,
    message,
	Spin,
} from "antd";
import styles from "./Profile.module.scss";
import { AiFillEdit } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
    useLazyGetProfileQuery,
    useUpdateProfileLowMutation,
} from "@store/api/user/userApi";
import { setProfile } from "@store/user/userSlice";
import { BsPersonFill } from "react-icons/bs";

type FieldsType = {
    name: string;
    email: string;
};

export const Profile = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [editable, setEditable] = useState(false);
    const [form] = Form.useForm<FieldsType>();
    const dispatch = useDispatch();

    const [getProfile, profileData] = useLazyGetProfileQuery();
    const [updateProfile, updateProfileData] = useUpdateProfileLowMutation();

    const handleSubmit = async () => {
        try {
            const values = form.getFieldsValue();

            if (!values.name && !values.email) {
                return;
            }

            await updateProfile({
                name: values.name ?? profileData.data?.data.name,
                email: values.email ?? profileData.data?.data.email,
            }).then((res) => {
                if (res.data) {
					form.setFieldsValue({
                        name: res.data?.name,
                        email: res.data?.email,
                    });
                    message.success("Профиль обновлён");
                }

                if (res.error) {
                    message.error("Ошибка обновления профиля");
                }
            });
        } finally {
            setEditable(false);
        }
    };

    useEffect(() => {
        getProfile().then((res) => {
            if (res.data) {
                dispatch(setProfile(res.data.data));
				form.setFieldsValue({
                    name: res.data.data.name,
                    email: res.data.data.email,
                });
            }

            if (res.error) {
                message.error("Ошибка загрузки профиля");
            }
        });
    }, []);

    return (
        <section className={styles.profile} ref={containerRef}>
            <div className={styles["left-panel"]}>
                <Avatar shape="square" size={250} src={profileData.data?.data.pict_url}>
					{profileData.isLoading ? (
						<Spin />
					) : (
						<BsPersonFill size={92} />
					)}
                </Avatar>
                <Tooltip title="Редактировать профиль" placement="bottom">
                    <Button
                        icon={<AiFillEdit />}
                        onClick={() => setEditable(!editable)}
                    />
                </Tooltip>
            </div>
            <div className={styles["right-panel"]}>
                <Card title="Профиль" loading={profileData.isLoading}>
                    <Form
                        form={form}
                        name="profile-form"
						initialValues={{
							name:  profileData.data?.data.name,
							email:  profileData.data?.data.email,
						}}
					>
                        <Flex vertical gap={12}>
                            <Form.Item name="name">
                                <Input
                                    placeholder="Имя"
                                    variant={
                                        !editable ? "borderless" : undefined
                                    }
                                    disabled={!editable}
                                />
                            </Form.Item>
                        </Flex>
                        <Flex vertical gap={12}>
                            <Form.Item name="email">
                                <Input
                                    placeholder="email"
                                    variant={
                                        !editable ? "borderless" : undefined
                                    }
                                    type="email"
                                    disabled={!editable}
                                />
                            </Form.Item>
                        </Flex>
                        {editable && (
                            <Flex gap={12}>
                                <Button onClick={() => setEditable(false)}>
                                    Отмена
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleSubmit}
                                    loading={updateProfileData.isLoading}
								>
                                    Сохранить
                                </Button>
                            </Flex>
                        )}
                    </Form>
                </Card>
            </div>
        </section>
    );
};
