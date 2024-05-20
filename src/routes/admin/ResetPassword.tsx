import { useState } from "react";

//controller
import axios from "../../../server/api/axios";
import { useNavigate } from "react-router-dom";

//ui
import Layout from "../../components/Layout";
import { FormProps, Typography, message } from "antd";
import Button from "../../components/Button";
import InputPassword from "../../components/InputPassword";
import { Form } from "antd";
import Input from "../../components/Input";
import Modal from "../../components/Modal";

interface AdminPassword {
  password: string;
}

const ResetPassword = () => {
  const [onConfirm, setOnConfirm] = useState<boolean>(false);
  const [value, setValue] = useState<AdminPassword | undefined>(undefined);
  const [messageApi, contextMesage] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate()

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const request = await axios.post(`/auth/reset-password`, value);
      if (request.status === 200 && request.data.status === "ok") {
        navigate(`/auth/login`);
      }
    } catch (error) {
      console.log(error);
      
      messageApi.error(`Sorry somehing went wrong: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setOnConfirm(false);
    setValue(undefined);
  };

  const onFinish: FormProps<AdminPassword>["onFinish"] = (values: any) => {
    setValue(values);
    setOnConfirm(true);
  };
  return (
    <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
      {contextMesage}
      <div
        style={{
          width: "300px",
          height: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          margin: "auto",
          padding: "16px",
          backgroundColor: "#fff",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div>Reset password</div>

        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Username is required." }]}
          >
            <Input
              size={"small"}
              placeholder={"Current username"}
              variant={undefined}
            />
          </Form.Item>
          <Form.Item
            required
            name="password"
            rules={[
              {
                min: 8,
                message: "Passwor must have at least 8 character or more",
              },
              { required: true, message: "Password is required." },
            ]}
          >
            <InputPassword size={"small"} placeholder={"New password"} />
          </Form.Item>
          <Button
            htmlType="submit"
            style={{
              width: "100%",
              backgroundColor: "#1982c4",
              color: "#fff",
              borderRadius: "30px",
            }}
          >
            Continue
          </Button>
        </Form>
      </div>
      <Modal
      onFunction={handleContinue}
      title="Confirm reset/change password"
      width={400}
        loading={isLoading}
        children={<Layout style={{ width: "100%", height: "auto" }}></Layout>}
        openModal={onConfirm}
        setCloseModal={handleCancelConfirm}
      />
    </Layout>
  );
};

export default ResetPassword;
