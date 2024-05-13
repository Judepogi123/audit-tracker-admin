import React from "react";
import Lottie from "lottie-react";
import Layout from "../../components/Layout";
import Spinner from "../../components/Spinner";
import { NewLocaleProps } from "../../interface/locale";

import warning from "../../assets/animations/warning-0.json";
import success from "../../assets/animations/success-001.json";

import { Typography } from "antd";

interface ConfirmProps {
  formValue: NewLocaleProps;
  setFormValue: React.Dispatch<React.SetStateAction<NewLocaleProps>>;
  isResult: "loading" | "default" | "success" | "existed" | "failed";
  setIsResult: React.Dispatch<
    React.SetStateAction<
      "loading" | "default" | "success" | "existed" | "failed"
    >
  >;
  handCancelOnConfirm: () => void;
}

const ConfirmLocaleInfo = ({
  formValue,
  setFormValue,
  isResult,
  setIsResult,
  handCancelOnConfirm,
}: ConfirmProps) => {
  const handleGetName = (value: string, type: string) => {
    try {
      const temp = value.split("-");
      if (type === "name") return temp[1];
      return temp[0];
    } catch (error) {
      console.log(error);
    }
  };

  const zipCode =
    formValue.localeType === "municipal"
      ? formValue.zipCode
      : handleGetName(formValue.municipality, "code");

  function removeSpaces(str: string) {
    return str.replace(/\s/g, "");
  }

  const username = `${zipCode}-${formValue.localeName}`
    .replace(/\s/g, "")
    .toLowerCase();
  const password = `${zipCode}-${removeSpaces(
    formValue.localeName
  )}-dilg`.toLowerCase();

  const renderStatus = () => {
    switch (isResult) {
      case "default":
        return (
          <div style={{width: "100%",height: "200px"}}>
            <div style={{ width: "100%", display: "flex", gap: "16px" }}>
              <Typography>Locale Type:</Typography>

              <Typography style={{ fontWeight: "bold" }}>
                {formValue.localeType === "municipal"
                  ? "Municipal"
                  : "Barangay"}
              </Typography>
            </div>
            <div style={{ width: "100%", display: "flex", gap: "16px" }}>
              <Typography>Locale name:</Typography>

              <Typography style={{ fontWeight: "bold" }}>
                {formValue.localeName}
              </Typography>
            </div>

            {formValue.localeType === "barangay" && (
              <div style={{ width: "100%", display: "flex", gap: "16px" }}>
                <Typography>Municipality:</Typography>

                <Typography style={{ fontWeight: "bold" }}>
                  {handleGetName(formValue.municipality, "name")}
                </Typography>
              </div>
            )}
            {formValue.localeType === "municipal" && (
              <div style={{ width: "100%", display: "flex", gap: "16px" }}>
                <Typography>Zip code:</Typography>

                <Typography style={{ fontWeight: "bold" }}>
                  {formValue.zipCode}
                </Typography>
              </div>
            )}
          </div>
        );
      case "existed":
        return (
          <Layout
            style={{
              width: "100%",
              height: "300px",
              display: "grid",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ margin: "auto", width: "200px", height: "300px" }}>
              <Lottie animationData={warning} loop={true} />
              <div>
                <Typography
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  Locale or user already exist.
                </Typography>
              </div>
            </div>
          </Layout>
        );
      case "success":
        return (
          <Layout
            style={{
              width: "100%",
              height: "300px",
              display: "flex",
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", height: "auto" }}>
              <div
                style={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "150px" }}>
                  <Lottie width={500} animationData={success} loop={false} />
                </div>
              </div>

              <div>
                <Typography
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "1rem",
                  }}
                >
                  Saved successfully
                </Typography>

                <div
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "16px 4px",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Typography>Username:</Typography>
                    <Typography style={{ fontWeight: "bold" }}>
                      {username}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Typography>Password:</Typography>
                    <Typography style={{ fontWeight: "bold" }}>
                      {password}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        );
      case "loading":
        return (
          <Layout
            style={{
              width: "100%",
              height: "300px",
              display: "grid",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ margin: "auto", width: "200px", height: "300px" }}>
              <div style={{ width: "100%", height: "50%", display: "grid" }}>
                <Spinner style={{margin: "auto"}} size="large" />
              </div>
              <div>
                <Typography
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  Please wait
                </Typography>
              </div>
            </div>
          </Layout>
        );

      default:
        break;
    }
  };
  return (
    <Layout
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      {renderStatus()}
    </Layout>
  );
};

export default ConfirmLocaleInfo;
