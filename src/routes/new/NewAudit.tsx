import { useEffect, useState } from "react";
import { v4 as genId } from "uuid";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../server/api/axios";
import { handleGenerateDate } from "../../provider/CurrentDateProvider";

import Layout from "../../components/Layout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import Checkbox from "../../components/Checkbox";
import Radio from "../../components/Radio";
import Modal from "../../components/Modal";
import NewAuditKey from "./NewAuditKey";
import NewAuditConfirmSave from "./NewAuditConfirmSave";

import {
  NewAudit as NewAuditProps,
  SelectProps,
  KeysProps,
} from "../../interface/manage";

import { Form, Typography, Radio as Radios, FormProps, message } from "antd";

const typeList = [];

const NewAudit = () => {
  const [messageApi, contextMessage] = message.useMessage();
  const [newKey, setNewKey] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<NewAuditProps | null>(null);
  const [onConfirm, setOnConfirm] = useState<boolean>(false);
  const [allKeyList, setAllKeyList] = useState<SelectProps[]>();
  const [saveResult, setSaveResult] = useState<
    "default" | "success" | "failed" | "loading"
  >("default");
  const[keyType,setKeyType]= useState<string>("municipal")

  const handleCloseCreateKey = () => {
    setNewKey(false);
  };

  const onFinish: FormProps<NewAuditProps>["onFinish"] = (values) => {
    console.log("Success:", formValue);
    setFormValue(values);
    setOnConfirm(true);
  };

  const onFinishFailed: FormProps<NewAuditProps>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handlebindKey: FormProps<NewAuditProps>["onFinish"] = (values) => {
    setNewKey(true);
    setFormValue(values);
  };

  const {
    data: keyList,
    isLoading: keysIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["keyList"],
    queryFn: () => axios.get("/data/key-list"),
  });

  const hanleCheckAudit = async () => {
    let genKey = genId();
    try {
      const request = await axios.post("/data/new-binding-Key", {
        key: formValue?.keys,
        genKey: genKey,
        date: await handleGenerateDate(),
        type: keyType
      });
      if (request.status === 200) {
        messageApi.success(`Success!`);
        refetch();
        setNewKey(false);
      } else {
        console.log("Failed", request.data);
      }
    } catch (error) {
      messageApi.error(`Sorry something went: ${error}`);
    }
  };

  const handleSelectItem = () => {
    try {
      let temp: SelectProps[] = [];
      if (keyList?.data) {
        const tempKeyList: KeysProps[] = [...keyList.data];
        for (let key of tempKeyList) {
          temp.push({ label: key.key, value: key.key, disabled: key.binded });
        }
      }
      console.log(temp);

      setAllKeyList(temp);
    } catch (error) {}
  };

  useEffect(() => {
    handleSelectItem();
  }, [keyList?.data]);

  const handleCancelCOnfirm = () => {
    setSaveResult("default");
    setOnConfirm(false);
  };

  const handleSaveNewAudit = async () => {
    try {
      const request = await axios.post("/data/new-audit", formValue);
      if (request.status === 200) {
        refetch();
        setFormValue(null)
        setSaveResult("success");
      } else {
        setSaveResult("failed");
      }
    } catch (error) {
      setSaveResult("failed");
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {contextMessage}
      <Form
        style={{
          width: "100%",
          height: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        wrapperCol={{ span: 16 }}
      >
        <div style={{ width: "100%" }}>
          <div style={{ padding: "16px" }}>
            <Typography style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Create new Audit
            </Typography>
          </div>

          <Form.Item
            name="title"
            label="Title"
            wrapperCol={{ span: 10 }}
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: "Title is required!" }]}
          >
            <div style={{ width: "100%" }}>
              <Input
                size={"small"}
                placeholder={"Type audit title here"}
                variant={undefined}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="acronym"
            label="Abbreviation"
            wrapperCol={{ span: 10 }}
            labelCol={{ span: 3 }}
            rules={[{ required: true, message: "Acronym is required!" }]}
          >
            <div style={{ width: "100%" }}>
              <Input
                size={"small"}
                placeholder={"Type audit title here"}
                variant={undefined}
              />
            </div>
          </Form.Item>

          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <Form.Item
              name="keys"
              label="Keys"
              wrapperCol={{ span: 16 }}
              labelCol={{ span: 8 }}
              rules={[{ required: true, message: "Key is required!" }]}
            >
              <Select
                style={{ width: 360 }}
                disabled={keysIsLoading ? true : false}
                loading={keysIsLoading ? true : false}
                placeholder="Select a key to bind"
                options={allKeyList as SelectProps[]}
                size={undefined}
              />
            </Form.Item>
            <Button onClick={() => setNewKey(true)}>Create</Button>
          </div>

          <Form.Item name="type" label="Type" wrapperCol={{ span: 12 }}  labelCol={{ span: 3 }} initialValue="municipal">
            <div style={{ width: "100%" }}>
              <Radios.Group onChange={(e)=> setKeyType(e.target.value)} defaultValue="municipal">
                <Radio value="municipal">Municipal</Radio>
                <Radio value="barangay">Barangay</Radio>
              </Radios.Group>
            </div>
          </Form.Item>
        </div>

        <div
          style={{
            width: "100%",
            padding: "8px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <Button onClick={()=> history.back()}>Cancel</Button>
          <Button
            htmlType="submit"
            style={{ backgroundColor: "#0077b6", color: "#fff" }}
          >
            Save
          </Button>
        </div>
      </Form>
      <Modal
        onFunction={hanleCheckAudit}
        width={600}
        children={
          <NewAuditKey
          keyType={keyType}
            setFormValue={setFormValue}
            messageApi={messageApi}
            formValues={formValue as NewAuditProps}
          />
        }
        openModal={newKey}
        setCloseModal={handleCloseCreateKey}
      />

      <Modal
        onFunction={handleSaveNewAudit}
        title="Audit info"
        width={500}
        children={
          <NewAuditConfirmSave
            setSaveResult={setSaveResult}
            saveResult={saveResult}
            messageApi={messageApi}
            formValues={formValue as NewAuditProps}
          />
        }
        openModal={onConfirm}
        setCloseModal={handleCancelCOnfirm}
      />
    </Layout>
  );
};

export default NewAudit;
