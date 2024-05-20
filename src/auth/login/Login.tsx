import { useState } from "react";
import Button from "../../components/Button";
import InputPassword from "../../components/InputPassword";
import Input from "../../components/Input";
import { message } from "antd";

import { Outlet, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Layout, Typography, Form } from "antd";

import "./style.css";
import axios from "../../../server/api/axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

interface FormFields {
  username: string;
  password: string;
}

function Login() {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageApi, contextMessage] = message.useMessage();
  const [isError, setIsError] = useState<{
    message: string;
    target: string;
    status: boolean;
  }>();

  console.log(isError);

  async function onFinish(values: FormFields) {
    setIsLoading(true);
    try {
      const response = await axios.post("auth/login", values);

      if (response.data.status === false) {
        messageApi.error(response.data.message);
        setIsError(response.data);
        setIsLoading(false);
        return;
      }

      const token = response.data.token;

      if (
        signIn({
          auth: {
            token: token,
            type: "Bearer",
          },
          userState: {
            name: response.data.username,
          },
        })
      ) {
        setIsLoading(false);
        navigate("/");
      } else {
        setIsError({ message: "Sign-in failed", target: "", status: false });
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error);
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout
      style={{
        width: "100dvw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {contextMessage}
      <div className="login-container">
        <Form
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="login-header">
            <div className="title">
              <Typography.Title level={2} color="red">
                Loginn
              </Typography.Title>
            </div>

            <Form.Item
              name="username"
              rules={[{ required: true, message: "Email is required!" }]}
            >
              <Input size="large" placeholder="Email" variant={"outlined"} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Password is required!" },
                {
                  required: isError?.status && isError.target === "password",
                  message: isError?.message,
                },
              ]}
            >
              <InputPassword
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="defaultSize"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="link" children="Forgot password"></Button>
            </Form.Item>
          </div>

          <div className="login-footer">
            <Button
              loading={isLoading}
              style={{ backgroundColor: "#3a86ff", height: "40px" }}
              htmlType="submit"
              type={"primary"}
              children={"Login"}
            />
          </div>
        </Form>
      </div>
      <Outlet />
    </Layout>
  );
}

export default Login;
