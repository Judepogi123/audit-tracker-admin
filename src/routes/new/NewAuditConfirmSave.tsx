import React from "react";

import Layout from "../../components/Layout";
import { Typography, Form } from "antd";
import { MessageInstance } from "antd/es/message/interface";

import { NewAudit } from "../../interface/manage";

import Lottie from "lottie-react";

import warning from "../../assets/animations/warning-0.json";
import success from "../../assets/animations/success-001.json";

interface ConfirmProps {
  messageApi: MessageInstance;
  formValues: NewAudit;
  setSaveResult: React.Dispatch<
    React.SetStateAction<"default" | "success" | "failed" | "loading">
  >;
  saveResult: "default" | "success" | "failed" | "loading";
}

const NewAuditConfirmSave = ({
  messageApi,
  formValues,
  saveResult,
}: ConfirmProps) => {
  const handleRenderResult = () => {
    switch (saveResult) {
      case "success":
        return (
          <Layout
            style={{
              width: "100%",
              height: "auto",
              minHeight: "300px",
              display: "grid",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "150px",
                margin: "auto",
              }}
            >
              <Lottie animationData={success} loop={false} />
              <div>
                <Typography
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  New audit successfully created.
                </Typography>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: "8px",
                  marginTop: "16px",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </Layout>
        );
      case "default":
        return <Default formValues={formValues} />;
      case "failed":
        return (
          <Layout
            style={{
              width: "100%",
              height: "auto",
              minHeight: "300px",
              display: "flex",

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "250px",
              }}
            >
              <Lottie animationData={warning} loop={true} />
              <div>
                <Typography
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Failed to create new audit
                </Typography>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: "8px",
                  marginTop: "16px",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </Layout>
        );
      default:
        return <Default formValues={formValues} />;
    }
  };
  return (
    <Layout
      style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}
    >
      {handleRenderResult()}
    </Layout>
  );
};

export default NewAuditConfirmSave;

const Default = ({ formValues }: { formValues: NewAudit }) => {
  return (
    <Form
      wrapperCol={{ span: 12 }}
      style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "8px" }}
    >
      <Form.Item label="Title">
        <Typography style={{ fontWeight: "bold" }}>
          {formValues.title}
        </Typography>
      </Form.Item>
      <Form.Item label="Acronym">
        <Typography style={{ fontWeight: "bold" }}>
          {formValues.acronym}
        </Typography>
      </Form.Item>
      <Form.Item label="Key" wrapperCol={{ span: 24 }}>
        <Typography style={{ fontWeight: "bold" }}>
          {formValues.keys}
        </Typography>
      </Form.Item>
      <Form.Item label="Type">
        <Typography style={{ fontWeight: "bold" }}>
          {formValues.type === "municipal" ? "Municipal" : "Barangay"}
        </Typography>
      </Form.Item>
    </Form>
  );
};
