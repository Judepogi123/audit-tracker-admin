import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Typography, Space, Radio as MainRadio } from "antd";

import Layout from "../../../components/Layout";
import Tooltip from "../../../components/Tooltip";
import Select from "../../../components/Select";
import Checkbox from "../../../components/Checkbox";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Radio from "../../../components/Radio";

import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

interface UserProps {
  username: string;
  password: string;
  assignedMunicipal: string;
  type: string;
  adminType?: string;
  authority: string;
}

type LayoutType = Parameters<typeof Form>[0]["layout"];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const NewUser = () => {
  const { newUserID } = useParams();

  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const formItemLayout =
    formLayout === "horizontal"
      ? { labelCol: { span: 4 }, wrapperCol: { span: 10 } }
      : null;

  const buttonItemLayout =
    formLayout === "horizontal"
      ? { wrapperCol: { span: 14, offset: 4 } }
      : null;

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Layout style={{ width: "100%", height: "100%", display: "flex" }}>
      <div style={{ width: "100%", height: "100%", padding: "5px", border: "1px solid #ccc", }}>
        <Form
          onFinish={onFinish}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "100%", height: "auto" }}>
            <div style={{ padding: "5px" }}>
              <Typography.Title level={4}>Add new user</Typography.Title>
            </div>
            <Form.Item name="field" label="User type" wrapperCol={{ span: 8 }}>
              <MainRadio.Group>
                <Space direction="vertical">
                  <Radio value="0">Provincial Office user</Radio>
                  <Radio value="1">Field Office user</Radio>
                </Space>
              </MainRadio.Group>
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input
                placeholder="Input username"
                size={"small"}
                variant={undefined}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input
                placeholder="Input password"
                size={"small"}
                variant={undefined}
              />
            </Form.Item>
          </div>

          <div style={{display: "flex", width: "100%", alignItems: "center", justifyContent: "flex-end", padding: "5px 15px"}}>
            <Form.Item >
              <Button htmlType="submit">Cancel</Button>
              <Button
                htmlType="submit"
                onClick={onFinish}
                style={{ backgroundColor: "#3a86ff", color: "#fff",marginLeft:"10px" }}
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default NewUser;
