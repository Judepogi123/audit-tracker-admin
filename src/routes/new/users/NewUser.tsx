import { useState, useEffect, SetStateAction } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Space, Radio as MainRadio, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import type { FormProps } from "antd";

import axios from "../../../../server/api/axios";

import Layout from "../../../components/Layout";
import Tooltip from "../../../components/Tooltip";
import Select from "../../../components/Select";
import Checkbox from "../../../components/Checkbox";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Radio from "../../../components/Radio";

import ConfirmUser from "./ConfrimUser";
import { Radio as Radios, Form } from "antd";

import { FaRandom } from "react-icons/fa";

interface UserProps {
  username: string;
  password: string;
  assignedMunicipal: string;
  type: string;
  adminType?: string;
  authority: string;
}

interface SelectProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface MunicipalityProps {
  municipalityName: string;
  zipCode: number;
  type: string
}

interface UserDataProps {
  username: string;
  password: string;
  assignedMunicipal: string;
  userType: string;
  adminType?: string;
  authority: string;
  compliance: string;
  users: string;
  files: string;
  municipals: string;
  archived: string;
  logs: string;
  fields: string;
  barangay: string;
  audit: string
}

interface StatusProps {
  message: string;
  status: string;
}

const NewUser = () => {
  const navigate = useNavigate();

  const [onConfirm, setOnConfirm] = useState<boolean>(false);
  const [messageApi, contextMessage] = message.useMessage();
  const [isStatus, setIsStatus] = useState<StatusProps>({
    message: "null",
    status: "null",
  });
  const [selectMun, setSelectMun] = useState<SelectProps[] | []>();
  const [formValue, setFormValue] = useState<UserDataProps>();
  const [showMunicipalSelect, setShowMunicipalSelect] =
    useState<string>("provincial");

  const {
    data: townList,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["townList"],
    queryFn: () => axios.get("/data/municipalities"),
  });

  useEffect(() => {
    if (isError) {
      messageApi.error(
        `Sorry something went wrong with fetching municipalities: ${error}.`
      );
    }
  }, [isError]);

  console.log(showMunicipalSelect);
  

  const handleSelectValue = (data: MunicipalityProps[]) => {
    if (!Array.isArray(data)) return [];
    const dataCopy = data.filter((item)=> item.type === showMunicipalSelect)
    let temp: SelectProps[] = [];
    for (let item of dataCopy) {
      temp.push({ label: item.municipalityName, value: item.zipCode });
    }
    return temp;
  };

  useEffect(() => {
    if (townList?.status === 200) {
      const data = handleSelectValue(townList.data as MunicipalityProps[]);
      setSelectMun(data);
    }
  }, [townList?.data,showMunicipalSelect]);

  const onFinish: FormProps<UserDataProps>["onFinish"] = (values) => {
    console.log("Success:", values);
    setFormValue(values);
    setOnConfirm(true);
  };

  const handleCloseConfirm = () => {
    setIsStatus({ message: "null", status: "null" });
    setFormValue(undefined);
    setOnConfirm(false);
  };

  // const onFinishFailed: FormProps<UserDataProps>["onFinishFailed"] = (
  //   errorInfo
  // ) => {
  //   console.log("Failed:", errorInfo);
  // };

  const handleUserTypeChange = (value: string) => {
    setShowMunicipalSelect(value);
  };

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#fff",
      }}
    >
      {contextMessage}

      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "5px",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "auto",
          }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item style={{ maxWidth: 600, padding: "10px" }}>
            <div style={{ padding: "10px" }}>
              <Typography.Title level={3}>Add new user</Typography.Title>
            </div>
            <Form.Item
              label="User type"
              name="userType"
              initialValue={"provincial"}
              required
            >
              <Radios.Group
                value={formValue?.userType}
                defaultValue={"provincial"}
                onChange={(e) => handleUserTypeChange(e.target.value)}
              >
                <Radio value={"provincial"}>Provicial Office User</Radio>
                <Radio value={"municipal"}>Field Office User</Radio>
                <Radio value={"barangay"}>Barangay User</Radio>
              </Radios.Group>
            </Form.Item>

            {showMunicipalSelect === "municipal" ? (
              <Form.Item
                label="Municipal"
                name="assignedMunicipal"
                rules={[{ required: true, message: "Municipal is required!" }]}
              >
                <Select
                  value={formValue?.assignedMunicipal}
                  placeholder="Please select municipal"
                  options={selectMun as SelectProps[]}
                  size={undefined}
                />
              </Form.Item>
            ) : showMunicipalSelect === "barangay" ? (
              
              <Form.Item
                label="Barangay"
                name="barangay"
                rules={[{ required: true, message: "Municipal is required!" }]}
              >
                <Select
                  value={formValue?.assignedMunicipal}
                  placeholder="Please select municipal"
                  options={selectMun as SelectProps[]}
                  size={undefined}
                />
              </Form.Item>
            ) : null}

            {/* {showMunicipalSelect == "barangay" && (
              <Form.Item
                label="Municipal"
                name="assignedMunicipal"
                rules={[{ required: true, message: "Municipal is required!" }]}
              >
                <Select
                  value={formValue?.assignedMunicipal}
                  placeholder="Please select municipal"
                  options={selectMun as SelectProps[]}
                  size={undefined}
                />
              </Form.Item>
            )} */}

            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Username is required!" }]}
            >
              <Input
                value={formValue?.username}
                size={"small"}
                placeholder={""}
                variant={undefined}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required!" }]}
            >
              <Input
                value={formValue?.password}
                size={"small"}
                placeholder={""}
                variant={undefined}
              />
            </Form.Item>

            {showMunicipalSelect ==="provincial" ? (
              <Form.Item label="Permission" wrapperCol={{ span: 16 }} required>
                <Form.Item
                  label="Audit"
                  name="audit"
                  labelCol={{ span: 6 }}
                  initialValue={"auditR"}
                >
                  <Radios.Group defaultValue="auditR">
                    <Radio value="auditR">Read only</Radio>
                    <Radio value="auditRnW">Read and Write </Radio>
                  </Radios.Group>
                </Form.Item>

                <Form.Item
                  label="Compliance"
                  name="compliance"
                  labelCol={{ span: 6 }}
                  initialValue={"complianceR"}
                >
                  <Radios.Group defaultValue="complianceR">
                    <Radio value="complianceR">Read only</Radio>
                    <Radio value="complianceRnW">Read and Write </Radio>
                  </Radios.Group>
                </Form.Item>

                <Form.Item
                  label="Fields"
                  name="fields"
                  labelCol={{ span: 6 }}
                  initialValue={"fieldR"}
                >
                  <Radios.Group defaultValue="fieldR">
                    <Radio value="fieldR">Read only</Radio>
                    <Radio value="fieldRnW">Read and Write </Radio>
                  </Radios.Group>
                </Form.Item>

                <Form.Item
                  label="Locale"
                  name="locale"
                  labelCol={{ span: 6 }}
                  initialValue={"minicipalsR"}
                >
                  <Radios.Group defaultValue="minicipalsR">
                    <Radio value="minicipalsR">Read only</Radio>
                    <Radio value="minicipalsRnW">Read and Write</Radio>
                  </Radios.Group>
                </Form.Item>

                <Form.Item
                  label="Users"
                  name="users"
                  labelCol={{ span: 6 }}
                  initialValue={"usersR"}
                >
                  <Radios.Group defaultValue="usersR">
                    <Radio value="usersR">Read only</Radio>
                    <Radio value="usersRnW">Read and Write </Radio>
                  </Radios.Group>
                </Form.Item>

                <Form.Item
                  label="Files"
                  name="files"
                  labelCol={{ span: 6 }}
                  initialValue={"filesR"}
                >
                  <Radios.Group defaultValue="filesR">
                    <Radio value="filesR">Read only</Radio>
                    <Radio value="filesRnW">Read and Write </Radio>
                  </Radios.Group>
                </Form.Item>

                <Form.Item
                  label="Archived"
                  name="archived"
                  labelCol={{ span: 6 }}
                  initialValue={"archivedR"}
                >
                  <Radios.Group defaultValue="archivedR">
                    <Radio value="archivedR">Read only</Radio>
                    <Radio value="archivedRnW">Read and Write </Radio>
                  </Radios.Group>
                </Form.Item>

                <Form.Item
                  label="Activity Logs"
                  name="logs"
                  labelCol={{ span: 6 }}
                  initialValue={"logsR"}
                >
                  <Radios.Group defaultValue="logsR">
                    <Radio value="logsR">Hidden</Radio>
                    <Radio value="logsRnW">Visible</Radio>
                  </Radios.Group>
                </Form.Item>
              </Form.Item>
            ): null}
          </Form.Item>

          <div
            style={{
              padding: "8px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              htmlType="submit"
              style={{ backgroundColor: "#0077b6", color: "#fff" }}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
      <Modal
        title="New user info"
        width={600}
        loading={isStatus.status === "loading" ? true : false}
        okHid={true}
        cancelHid={true}
        children={
          <ConfirmUser
            setFormValue={setFormValue}
            handleCloseConfirm={handleCloseConfirm}
            values={formValue}
            messageApi={messageApi}
            setIsStatus={setIsStatus}
            isStatus={isStatus}
          />
        }
        openModal={onConfirm}
        setCloseModal={handleCloseConfirm}
      />
    </Layout>
  );
};

export default NewUser;
