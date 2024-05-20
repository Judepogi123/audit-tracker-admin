import { useState, useEffect } from "react";

import axios from "../../../server/api/axios";
import { useQuery } from "@tanstack/react-query";

//layout/ui
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Select from "../../components/Select";
import Input from "../../components/Input";
import Radio from "../../components/Radio";
import { Radio as Radios } from "antd";


import { Form, Typography, FormProps } from "antd";
import { LocaleProps, NewLocaleProps } from "../../interface/locale";

import ConfirmLocaleInfo from "./ConfirmLocaleInfo";
import Modal from "../../components/Modal";

interface OptionProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const NewLocale = () => {
  const [lcoaleList, setLocaleList] = useState<OptionProps[] | []>();
  const [onConfirm, setOnConfirm] = useState<boolean>(false);
  const [localeType, setLocaleType] = useState<string>("municipal");
  const [isResult, setIsResult] = useState<
    "default" | "success" | "existed" | "failed" | "loading"
  >("default");

  console.log(isResult);
  

  const [formValue, setFormValue] = useState<NewLocaleProps>({
    localeType: "municipal", // Set a default value for localeType
    municipality: "",
    localeName: "",
    zipCode: "",
  });
  console.log(formValue);


  const onFinish: FormProps<NewLocaleProps>["onFinish"] = (values) => {
    setFormValue(values);
    setOnConfirm(true);
  };

  const onFinishFailed: FormProps<NewLocaleProps>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const { data: localeData } = useQuery({
    queryKey: ["lacaleData"],
    queryFn: () => axios.get(`/data/municipalities`),
  });

  useEffect(() => {
    const handleSelectItem = () => {
      if (!localeData?.data) return;
      try {
        let temp: OptionProps[] = [];
        const allLocale: LocaleProps[] = Object.values(
          localeData.data as LocaleProps[]
        ).filter((item) => item.type === "municipal");
        for (let item of allLocale) {
          temp.push({
            value: `${item.zipCode}-${item.municipalityName}`,
            label: item.municipalityName,
          });
        }
        setLocaleList(temp);
      } catch (error) {
        console.log(error);
      }
    };
    handleSelectItem();
  }, [localeData?.data]);

  const handleSaveLocale = async () => {
    setIsResult("loading");
    try {
      const request = await axios.post(`/data/new-locale`, formValue);
      if (request.status === 200 && request.data.status === "success") {
        console.log(request.data.message);
        setIsResult("success");
      } else if (request.status === 200 && request.data.status === "existed") {
        console.log(request.data.message);
        setIsResult("existed");
      } else {
        console.log(request.data.message);
        setIsResult("failed");
      }
    } catch (error) {
      console.log(error);
      setIsResult("failed");
    }
  };

  const handCancelOnConfirm = () => {
    setIsResult("default")
    setOnConfirm(false);
  };

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        overflowY: "auto",
      }}
    >
      <Form
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div>
          <div style={{ padding: "8px" }}>
            <Typography style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              New Locale
            </Typography>
          </div>
          <Form.Item
            label="Locale Type"
            name="localeType"
            wrapperCol={{ span: 8 }}
            labelCol={{ span: 4 }}
            initialValue="municipal"
          >
            <Radios.Group
              defaultValue="municipal"
              value={localeType}
              onChange={(e) => setLocaleType(e.target.value)}
            >
              <Radio value={"municipal"}>Municipal</Radio>
              <Radio value={"barangay"}>Barangay</Radio>
            </Radios.Group>
          </Form.Item>
          {localeType === "barangay" && (
            <>
              <Form.Item
                name="municipality"
                label="Municipality"
                wrapperCol={{ span: 4 }}
                labelCol={{ span: 4 }}
                rules={[
                  { required: true, message: "Municipality is required!" },
                ]}
              >
                <Select
                  options={lcoaleList as OptionProps[]}
                  size={undefined}
                />
              </Form.Item>
            </>
          )}

          {localeType === "municipal" && (
            <Form.Item
              name="zipCode"
              label="Zip Code"
              wrapperCol={{ span: 4 }}
              labelCol={{ span: 4 }}
              rules={[{ required: true, message: "Zip code is required!" }]}
            >
              <Input
                type="number"
                size={"small"}
                placeholder={""}
                variant={undefined}
              />
            </Form.Item>
          )}

          <Form.Item
            name="localeName"
            label="Locale Name"
            wrapperCol={{ span: 4 }}
            labelCol={{ span: 4 }}
            rules={[{ required: true, message: "Locale name is required!" }]}
          >
            <Input size={"small"} placeholder={""} variant={undefined} />
          </Form.Item>

          {/* <div>
            <Typography style={{ fontWeight: "initial", marginLeft: "50px" }}>
              Default User
            </Typography>
            <Form.Item
              name="username"
              label="Username"
              wrapperCol={{ span: 4 }}
              labelCol={{ span: 4 }}
              rules={[{ required: true, message: "Please input username!" }]}
            >
              <Input
                value={321}
                size={"small"}
                placeholder={""}
                variant={undefined}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              wrapperCol={{ span: 4 }}
              labelCol={{ span: 4 }}
              rules={[{ required: true, message: "Password is required!" }]}
            >
              <Input size={"small"} placeholder={""} variant={undefined} />
            </Form.Item>
          </div> */}
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px",
          }}
        >
          <Button
            style={{ backgroundColor: "#1982c4", color: "#fff" }}
            htmlType="submit"
          >
            Continue
          </Button>
        </div>
      </Form>
      <Modal
        onFunction={handleSaveLocale}
        okHid={isResult === "success" ? true : false}
        title="Save new locale"
        children={
          <ConfirmLocaleInfo
            handCancelOnConfirm={handCancelOnConfirm}
            formValue={formValue}
            setFormValue={setFormValue}
            setIsResult={setIsResult}
            isResult={isResult}
          />
        }
        openModal={onConfirm}
        setCloseModal={handCancelOnConfirm}
      />
    </Layout>
  );
};

export default NewLocale;
