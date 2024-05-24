import React, { useEffect, useState } from "react";

import {
  handleGenerateDate,
} from "../../../provider/CurrentDateProvider";
import { reasonList } from "./dataSourse";
import { hanldeSearchItem} from "../_external-function/_handleGetFieldName";

import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import Radio from "../../../components/Radio";
import Textarea from "../../../components/Textarea";

import {
  Typography,
  message,
  Radio as Radios,
  RadioChangeEvent,
} from "antd";

import axios from "../../../../server/api/axios";
import { useParams } from "react-router-dom";
import { useUserData } from "../../../provider/DataProvider";

import { PermissionsProps,IndicatorsProps,AreaProps } from "../../../interface/manage";
import { handleGetLocal } from "../../../utils/localStorage";

interface NotifyDataProps {
  query: string;
  pushKey: string;
  setOnNotify: React.Dispatch<React.SetStateAction<boolean>>;
  notify: string;
  setIndicatorList: React.Dispatch<
    React.SetStateAction<[] | IndicatorsProps[] | undefined>
  >;
  indicatorList: IndicatorsProps[] | [] | undefined;
  response: string;
  fieldPushkey: string
}

const NotifyList = ({
  query,
  pushKey,
  setOnNotify,
  notify,
  indicatorList,
  setIndicatorList,
  response,
  fieldPushkey
}: NotifyDataProps) => {
  const [notifyList, setNotifyList] =
    useState<{ title: string; dateSent: string }[]>();
  const [messageApi, contextMessage] = message.useMessage();
  const [selected, setSeletected] = useState<string>(reasonList[0].query);
  const [areaList, setAreaList] = useState<AreaProps[] | []>()
  const [messageText, setMessage] = useState<string | undefined>(undefined);
  const [permission, setPermission] = useState<PermissionsProps | string| null>(null)
  const [sendLoading, setSendIsLoading] = useState<boolean>();

  const user = useUserData()

  useEffect(()=>{
    const handleUserPersmission = ()=>{
      try {
        const temp: PermissionsProps = user.userPermission === "all" ? "all" : JSON.parse(user.userPermission);
        setPermission(temp)
      } catch (error) {
        messageApi.error(`Something went wrong with user permission`)
      }
    }

    handleUserPersmission()
    
    return ()=> setPermission(null)
  },[user])

  const handleGetAreas = async()=>{
    try {
      const temp = await handleGetLocal("areasList");
      const parsed: AreaProps[] = JSON.parse(temp as string);
      setAreaList(parsed)
    } catch (error) {
      messageApi.error(`${error}`)
    }
  }

  useEffect(()=>{
    handleGetAreas()
    return ()=> setAreaList([])
  },[])

  useEffect(() => {
    const notifyDataList: { title: string; dateSent: string }[] = JSON.parse(
      (notify as string) || "[]"
    );
    if (notifyDataList) {
      setNotifyList(notifyDataList);
    }
  }, [notify, indicatorList]);


  const { complianceID, zipCode } = useParams();

  if (!query && !pushKey && !notify) {
    return (
      <Layout
        style={{
          width: "100%",
          minHeight: "200px",
          height: "auto",
          display: "grid",
        }}
      >
        <Typography style={{ margin: "auto" }}>
          Error query or pushkey
        </Typography>
      </Layout>
    );
  }

  const onChanged = ({ target: { value } }: RadioChangeEvent) => {
    setSeletected(value);
  };

  const handleSendNotification = async () => {
    if (permission && typeof permission === 'object' && 'compliance' in permission) {
      if (permission.compliance === "complianceR" || user.userPermission === "all") {
        messageApi.warning(`Current user is not authorized for this action!`);
        return;
      }
    }
    if (selected === "others" && messageText === undefined) {
      messageApi.warning(`Please type something as message.`);
      return;
    }
    let temp: string;
    if (selected === "others" && messageText !== undefined) {
      temp = messageText;
    } else {
      temp = selected;
    }
    setSendIsLoading(true);
    let dateHolder = await handleGenerateDate();
    try {
      const indicatorListCopy = [...(indicatorList as IndicatorsProps[])];
      const walk = (indicator: IndicatorsProps[]) => {
        for (let item of Object.values(indicator)) {
          if (item.pushKey === pushKey) {
            const holder = item.notice;
            let parsedTemp:{ title: string; dateSent: string; }[] = JSON.parse(holder || "[]");
            const parsedData = [...Object.values(parsedTemp),{
              title: temp,
              dateSent: dateHolder,
            }];
            setNotifyList(parsedData);
            item.notice = JSON.stringify(parsedData);
            return;
          }

          if (item.subIndicator) {
            walk(item.subIndicator);
          }
        }
      };

      walk(indicatorList as IndicatorsProps[]);
      setIndicatorList(indicatorListCopy);

      const request = await axios.post("/data/notify-indicator", {
        data: temp,
        pushKey: pushKey,
        date: await handleGenerateDate(),
        complianceID,
        zipCode,
        title: hanldeSearchItem(fieldPushkey, areaList as AreaProps[])
      });
      if (request.status === 200) {
        setOnNotify(false);
        setSendIsLoading(false);
        messageApi.success(`Notification sent`);
      } else {
        messageApi.error(`Item not found!`);
      }
    } catch (error) {
      console.log(error);

      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setSendIsLoading(false);
    }
  };

  return (
    <Layout style={{ width: "100%", height: "auto"}}>
      {contextMessage}
      <div
        style={{
          width: "100%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginBottom: "20px",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          style={{
            fontSize: "1rem",
            fontWeight: "initial",
            textAlign: "center",
          }}
        >
          {query}
        </Typography>
        <Typography
          style={{
            fontSize: "1rem",
            fontWeight: "initial",
            textAlign: "center",
          }}
        >
          {response}
        </Typography>
      </div>

      <div style={{ width: "100%" }}>
        <Radios.Group
          onChange={onChanged}
          value={selected}
          style={{ width: "100%", backgroundColor: "#fff" }}
        >
          <div
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              backgroundColor: "#fff",
            }}
          >
            {reasonList.map((item, index) => (
              <Radio
                key={index}
                style={{
                  width: "100%",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                }}
                value={item.query}
              >
                {item.query}
              </Radio>
            ))}
          </div>
          <Radio
            style={{
              width: "100%",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginTop: "5px",
              backgroundColor: "#fff",
            }}
            value="others"
          >
            {"Others"}
          </Radio>
        </Radios.Group>
      </div>

      <div
        style={{
          display: selected === "others" ? "block" : "none",
          marginTop: "10px",
        }}
      >
        <Textarea
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here."
        />
      </div>

      <div
        style={{
          width: "100%",
          height: "auto",
          padding: "5px",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          loading={sendLoading}
          onClick={handleSendNotification}
          style={{ backgroundColor: "#00b4d8", color: "#fff" }}
        >
          Send
        </Button>
      </div>

      <div
        style={{
          width: "100%",
          height: "auto",
          minHeight: "150px",
          border: "1px solid #ccc",
          display:
            notify && Object.values(notify).length <= 0 ? "none" : "flex",
          flexDirection: "column",
          overflowY: "auto",
          padding: "8px",
          gap: "8px",
        }}
      >
        {notifyList &&
          Object.values(notifyList).map((item, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                display: "flex",
                gap: "5px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#fff",
              }}
            >
              <Typography
                style={{
                  width: "auto",
                  padding: "0px 5px",
                  fontWeight: "bold",
                }}
              >
                {item.dateSent}
              </Typography>
              {"-"}
              <Typography>{item.title}</Typography>
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default NotifyList;
