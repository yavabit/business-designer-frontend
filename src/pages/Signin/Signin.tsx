import type { FormProps } from "antd";
import { Button, Checkbox, Flex, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";

type FieldType = {
	email?: string;
	password?: string;
	remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
	console.log("Success:", values);
};

export const Signin = () => {
	const navigate = useNavigate()
	const [form] = useForm();

	const onReset = () => {
		form.resetFields();
	};

	const handleRegistrationLink = () => {
		navigate("/signup")
	}

	return (
		<div className="auth-form__container">
			<div className="auth-form__wrapper">
				<div className="auth-form__title">Войти в Business Designer</div>
				<Form
					form={form}
					name="basic"
					layout="vertical"
					style={{ width: 450 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="off"
				>
					<Form.Item<FieldType>
						label="Логин"
						name="email"
						rules={[{ required: true, message: "Пожалуйста, введите логин!" }]}
					>
						<Input allowClear/>
					</Form.Item>

					<Form.Item<FieldType>
						label="Пароль"
						name="password"
						rules={[{ required: true, message: "Пожалуйста, введите пароль!" }]}
					>
						<Input.Password allowClear/>
					</Form.Item>

					<Form.Item<FieldType>
						name="remember"
						valuePropName="checked"
						label={null}
					>
						<Checkbox>Запомнить меня</Checkbox>
					</Form.Item>

					<Form.Item>
						<Flex>
							<Button type="primary" htmlType="submit">
								Войти
							</Button>
							<Button
								htmlType="button"
								onClick={onReset}
								style={{ marginLeft: 10 }}
							>
								Сбросить
							</Button>
							<Button
								color="primary"
								variant="outlined"
								style={{ marginLeft: "auto" }}
								onClick={handleRegistrationLink}
							>
								Зарегистрироваться
							</Button>
						</Flex>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};
