import React from "react";
import Layout from "../../../components/Layout";
import Input from "../../../components/Input";
import Textarea from "../../../components/Textarea";
import Button from "../../../components/Button";

import { Typography, Form, FormProps } from "antd";

//interface
import { NewArea } from "../../../interface/manage";

interface NewAreaProps {
  setFormValue: React.Dispatch<React.SetStateAction<NewArea | null>>;
  formValue: NewArea | null;
  handleCloseNew: () => void;
  handleCraeteNewArea: (values: NewArea) => Promise<void>;
}

const ModalNewArea = ({
  setFormValue,
  handleCloseNew,
  handleCraeteNewArea,
}: NewAreaProps) => {
    
  const onFinish: FormProps<NewArea>["onFinish"] = async(values) => {
    await handleCraeteNewArea(values)
  };

  const onFinishFailed: FormProps<NewArea>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      <Form
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div>
          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required!" }]}
          >
            <Input size={"small"} placeholder={""} variant={undefined} />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            name="desc"
            label="Description"
          >
            <Textarea style={{maxHeight: "150px"}} />
          </Form.Item>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            gap: "8px",
          }}
        >
          <Button onClick={handleCloseNew}>Cancel</Button>
          <Button
            htmlType="submit"
            style={{ backgroundColor: "#48cae4", color: "#fff" }}
          >
            Save
          </Button>
        </div>
      </Form>
    </Layout>
  );
};

export default ModalNewArea;
