import React, { useState } from "react";
import Button from "../../components/Button";
import InputPassword from "../../components/InputPassword";
import Input from "../../components/Input";

import { Outlet, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Layout, Typography, Form, Divider } from "antd";
import { FcGoogle } from "react-icons/fc";

import "./style.css";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";


interface FormFields {
  username: string;
  password: string;
}

function Login() {
  const singnIn = useSignIn();
  const navigate = useNavigate();

  async function onFinish(values: FormFields) {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        values
      );

      if (
        singnIn({
          auth: {
            token: response.data.token,
            type: "Bearer",
          },
          userState: {
            name: response.data.username,
          },
        })
      ) {
        navigate("/");
      } else {
        navigate("/auth/login");
      }
      console.log(response.data);
    } catch (error) {
      console.log("Failed!", error);
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
      <div className="login-container">
        <Form
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="login-header">
            <div className="title">
              <Typography.Title level={2} color="red">
                Login
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
              rules={[{ required: true, message: "Password is required!" }]}
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
              style={{ backgroundColor: "#3a86ff", height: "40px" }}
              htmlType="submit"
              type={"primary"}
              children={"Login"}
            />
            <div>
              <Button
                type={"link"}
                children={"Don't have an account yet? Register"}
              ></Button>
            </div>
          </div>
        </Form>
      </div>
      <Outlet />
    </Layout>
  );
}

export default Login;
