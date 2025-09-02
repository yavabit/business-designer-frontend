import type { FormProps } from "antd";
import { Button, Form, Input, message, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
	firstname?: string;
	lastname?: string;
	email?: string;
	password?: string;
	confirm_password?: string;
};

export const Signup = () => {
	const [submittable, setSubmittable] = useState(false);
	const [form] = useForm();
	const navigate = useNavigate()
	const values = Form.useWatch([], form);

	const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
		try {
			const response = await fetch("/api/register", {
				method: "POST",
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (response.ok) {
				navigate("/projects")
			} else {
				if (data.error?.includes("email") || data.error?.includes("почт")) {
					form.setFields([
						{
							name: "email",
							errors: [data.error || "Этот email уже занят"],
						},
					]);
				} else {
					message.error(data.error || "Ошибка регистрации");
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

	useEffect(() => {
		form
			.validateFields({ validateOnly: true })
			.then(() => setSubmittable(true))
			.catch(() => setSubmittable(false));
	}, [form, values]);

	return (
		<div className="auth-form__container">
			<div className="auth-form__wrapper">
				<div className="auth-form__title">Регистрация в Business Designer</div>
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
						label="Имя"
						name="firstname"
						rules={[{ required: true, message: "Пожалуйста, введите имя!" }]}
					>
						<Input allowClear />
					</Form.Item>
					<Form.Item<FieldType>
						label="Фамилия"
						name="lastname"
						rules={[
							{ required: true, message: "Пожалуйста, введите фамилию!" },
						]}
					>
						<Input allowClear />
					</Form.Item>
					<Form.Item<FieldType>
						label="Электронная почта"
						name="email"
						rules={[{ required: true, message: "Пожалуйста, введите почту!" }]}
					>
						<Input allowClear />
					</Form.Item>
					<Form.Item<FieldType>
						label="Пароль"
						name="password"
						rules={[{ required: true, message: "Пожалуйста, введите пароль!" }]}
					>
						<Input.Password allowClear />
					</Form.Item>
					<Form.Item<FieldType>
						label="Повторить пароль"
						name="confirm_password"
						dependencies={["password"]}
						rules={[
							{ required: true, message: "Пожалуйста, подтвердите пароль!" },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("password") === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error("Пароли не совпадают!"));
								},
							}),
						]}
					>
						<Input.Password allowClear />
					</Form.Item>

					<Form.Item>
						<Space style={{ marginTop: 10 }}>
							<Button type="primary" htmlType="submit" disabled={!submittable}>
								Зарегистрироваться
							</Button>
							<Button htmlType="button" onClick={onReset}>
								Сбросить
							</Button>
						</Space>
					</Form.Item>
					<div className="auth-form__additional">
						<span>Есть аккаунт?</span>
						<Link to={"/login"}>Войти</Link>
					</div>
				</Form>
			</div>
		</div>
	);
};
