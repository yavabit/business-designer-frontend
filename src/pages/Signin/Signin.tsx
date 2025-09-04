import { baseUrl } from "@store/api/api";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
	email?: string;
	password?: string;
	remember?: string;
};

export const Signin = () => {
	const [form] = useForm();

	const navigate = useNavigate()

	const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
		try {
			const response = await fetch(`${baseUrl}/auth/login`, {
				method: "POST",
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (response.ok) {
				navigate("/projects")
			} else {
				if (data.error) {
					form.setFields([
						{
							name: "email",
							errors: [data.error || "Неверный логин или пароль"],
						},
						{
							name: "password",
							errors: [data.error || "Неверный логин или пароль"],
						},
					]);
				} else {
					message.error(data.error || "Ошибка входа");
				}
			}
		} catch (e) {			
			message.error("Ошибка сети");
			console.log(e);
		} finally {
			//setLoading(false);
		}
	};

	const onReset = () => {
		form.resetFields();
	};

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
						<Space>
							<Button type="primary" htmlType="submit">
								Войти
							</Button>
							<Button
								htmlType="button"
								onClick={onReset}
							>
								Сбросить
							</Button>
						</Space>
					</Form.Item>
					<div className="auth-form__additional">
						<span>Нет аккаунта?</span>
						<Link to={"/signup"}>Зарегистрироваться</Link>
					</div>
				</Form>
			</div>
		</div>
	);
};
