import { PrefetchLink } from "@components/PrefetchLink/PrefetchLink";
import { useTheme } from "@hooks/useTheme";
import { useLoginMutation } from "@store/api/user/userApi";
import { setCredentials } from "@store/user/userSlice";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export const Signin = () => {
  const { token } = useTheme();

  const [form] = useForm();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      if (!values.email || !values.password) {
        if (!values.email) {
          form.setFields([
            {
              name: "email",
              errors: ["Введите логин!"],
            },
          ]);
        }

        if (!values.password) {
          form.setFields([
            {
              name: "password",
              errors: ["Введите пароль!"],
            },
          ]);
        }

        return;
      }

      const creds = {
        email: values.email!,
        password: values.password!,
        isMemo: values.remember,
      };

      const response = await login(creds);

      if (response.data) {
        navigate("/projects");
        dispatch(setCredentials({
          email: response.data.data.email,
          id: response.data.data.id,
          accessToken: response.data.accessToken
        }))
      } else {
        if (response.error) {
          form.setFields([
            {
              name: "email",
              errors: ["Неверный логин или пароль"],
            },
            {
              name: "password",
              errors: ["Неверный логин или пароль"],
            },
          ]);
        } else {
          message.error("Ошибка входа");
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
    <div
      className="auth-form__container"
      style={{ backgroundColor: token.colorBgContainer }}
    >
      <div
        className="auth-form__wrapper"
        style={{
          backgroundColor: token.colorBgBase,
          borderColor: token.colorBorder,
        }}
      >
        <div className="auth-form__title" style={{ color: token.colorTextBase }}>Войти в Business Designer</div>
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
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите логин!",
              },
              {
                type: "email",
                message: "Введите корректный email!",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item<FieldType>
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите пароль!",
              },
            ]}
          >
            <Input.Password allowClear />
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
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Войти
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Сбросить
              </Button>
            </Space>
          </Form.Item>
          <div className="auth-form__additional">
            <span>Нет аккаунта?</span>
            <PrefetchLink
                to="/signup"
                prefetchImport={() =>
                    import("@pages/Signup/Signup").then(m => ({ default: m.Signup }))
                }>
                Зарегистрироваться
            </PrefetchLink>
          </div>
        </Form>
      </div>
    </div>
  );
};
