import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout";

import { Typography, message } from "antd";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";

import ViewMOV from "./ViewMOV";
import CheckIndicator from "./CheckIndicator";
import NotifyList from "./NotifyList";

import { CiSquareCheck } from "react-icons/ci";
import { IoNotifications } from "react-icons/io5";

//controller
import axios from "../../../../server/api/axios";
import { useUserData } from "../../../provider/DataProvider";
import { PermissionsProps, UserProps } from "../../../interface/manage";

interface ValueProps {
  title: string;
  key: string;
}

interface IndicatorsProps {
  dataInputMethod: {
    type: null | string;
    value: ValueProps[] | string | number;
  };
  query: string;
  id: string;
  mov: string;
  movDueDate: string | undefined | "null";
  path: string;
  title: string;
  type: "indicator" | "subIndicator";
  subIndicator: IndicatorsProps[];
  stage: number;
  status: boolean;
  answer: string;
  movFiles: string;
  pushKey: string;
  marked: boolean;
  notice: string;
}

interface ComplianceDataProps {
  fieldAnswers: string;
  fieldPushKey: string;
  pushKey: string;
  sender: string;
  status: string;
  timestamp: string;
  viewed: boolean;
  zipCode: string;
  senderInfo: UserProps;
  parsedAnswer: IndicatorsProps[];
  checkedBy: string;
  reviewed: string;
  userList: UserProps[];
}

interface ValueProps {
  title: string;
  key: string;
}
type ComplianceIndicator = {
  data: IndicatorsProps;
  setDataList: React.Dispatch<
    React.SetStateAction<ComplianceDataProps | undefined>
  >;
  dataList: ComplianceDataProps | undefined;
  compliancePushKey: string | undefined;
  setIndicatorList: React.Dispatch<
    React.SetStateAction<IndicatorsProps[] | [] | undefined>
  >;
  indicatorList: IndicatorsProps[] | [] | undefined;
  fieldList: FieldProps[];
  disabled: boolean;
  fieldPushkey: string;
};

interface FieldProps {
  id: string;
  title: string;
  type: string;
  dependencies: { method: string; value: number };
  description: string;
  indicators: IndicatorsProps[];
  pushKey: string;
}

const IndicatorItem = ({
  data,
  setDataList,
  dataList,
  compliancePushKey,
  setIndicatorList,
  indicatorList,
  fieldList,
  disabled,
  fieldPushkey,
}: ComplianceIndicator) => {
  const [onView, setOnView] = useState<boolean>(false);
  const [onCheck, setOnCheck] = useState<boolean>(false);
  const [onNotify, setOnNotify] = useState<boolean>(false);
  const [permission, setPermission] = useState<
    PermissionsProps | string | null
  >(null);

  const { complianceID, zipCode } = useParams();
  const [messageApi, contextMessage] = message.useMessage();

  const user = useUserData();

  useEffect(() => {
    const handleUserPersmission = () => {
      try {
        const temp: PermissionsProps =
          user.userPermission === "all"
            ? "all"
            : JSON.parse(user.userPermission);
        setPermission(temp);
      } catch (error) {
        messageApi.error(`Something went wrong with user permission`);
      }
    };

    handleUserPersmission();

    return () => setPermission(null);
  }, [user]);

  const handleViewMOV = () => {
    setOnView(true);
  };

  const handleNotify = () => {
    setOnNotify(true);
  };

  const handleCheck = () => {
    if (
      permission &&
      typeof permission === "object" &&
      "compliance" in permission
    ) {
      if (
        permission.compliance === "complianceR" ||
        user.userPermission === "all"
      ) {
        messageApi.warning(`Current user is not authorized for this action!`);
        return;
      }
    }
    setOnCheck(true);
  };

  const handleUpdateStatue = async (id: string, status: boolean) => {
    if (
      permission &&
      typeof permission === "object" &&
      "compliance" in permission
    ) {
      if (
        permission.compliance === "complianceR" ||
        user.userPermission === "all"
      ) {
        messageApi.warning(`Current user is not authorized for this action!`);
        return;
      }
    }
    if (!indicatorList) return;

    const temp: IndicatorsProps[] = [...indicatorList];

    try {
      const walk = (list: IndicatorsProps[]) => {
        for (const item of Object.values(list)) {
          if (item.pushKey === id) {
            item.status = !status;
            return;
          }
          if (item.subIndicator) {
            walk(item.subIndicator);
          }
        }
      };

      walk(temp);
      setIndicatorList(temp);
      setOnCheck(false);
      messageApi.success("Success!");

      await axios.post("/data/indicator-status", {
        zipCode: zipCode,
        pushKey: complianceID,
        indicatorID: id,
        indicatorStatus: status,
      });
    } catch (error) {
      messageApi.error(`Sorry somethimg went wrong: ${error}`);
    }
  };

  return (
    <Layout
      style={{
        width: "100%",
        height: "auto",
        borderRadius: "10px",
        backgroundColor: "#f1f1f1",
      }}
    >
      {contextMessage}
      <div
        style={{
          width: "100%",
          backgroundColor: "#f8f9fa",
          border: data.status ? "1px solid #38b000" : "1px solid #ccc",
          borderRadius: "5px",
          padding: "5px",
        }}
      >
        <div style={{ width: "100%", padding: "10px" }}>
          <Typography style={{ fontWeight: 700 }}>{data.query}</Typography>
        </div>
        <div
          style={{
            width: "100%",
            display: data.dataInputMethod.type === "null" ? "none" : "flex",
            gap: "10px",
            padding: "0px 20px",
          }}
        >
          <Typography style={{ width: "80px", fontWeight: 500 }}>
            Response:{" "}
          </Typography>
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            {data.dataInputMethod.type === "check_box" &&
            data.answer &&
            data.answer !== "null" ? (
              Object.values(JSON.parse(data.answer) as string[]).map(
                (item, index) => (
                  <div key={index}>
                    <Typography
                      style={{
                        fontWeight: 600,
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <CiSquareCheck fontSize={20} />
                      {item}
                    </Typography>
                  </div>
                )
              )
            ) : (
              <Typography style={{ fontWeight: "bold" }}>
                {data.answer === "null" || !data.answer
                  ? "No response yet."
                  : data.answer}
              </Typography>
            )}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: data.dataInputMethod.type === "null" ? "none" : "flex",
            justifyContent: "flex-end",
            gap: "5px",
            padding: "8px",
          }}
        >
          <Button size="small" disabled={disabled} onClick={handleViewMOV}>
            View MOV (
            {(data.movFiles !== undefined &&
              Object.values(JSON.parse(data.movFiles as string)).length) ||
              0}
            )
          </Button>

          <Button
            disabled={disabled}
            onClick={handleNotify}
            size="small"
            style={{ backgroundColor: "#0096c7" }}
          >
            <IoNotifications color="#f1f1f1" />
          </Button>
          <Button disabled={disabled} onClick={handleCheck} size="small">
            {data.status ? "Reviewed" : "Pending"}
          </Button>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          padding: "10px 0px 5px 50px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {data.subIndicator &&
          Object.values(data.subIndicator).map((item, index) => (
            <IndicatorItem
              fieldPushkey={fieldPushkey}
              disabled={disabled}
              fieldList={fieldList}
              setIndicatorList={setIndicatorList}
              indicatorList={indicatorList}
              compliancePushKey={compliancePushKey}
              setDataList={setDataList}
              dataList={dataList}
              key={index}
              data={item}
            />
          ))}
      </div>
      <Modal
        title="List of MOV"
        okHid={true}
        width={600}
        children={<ViewMOV data={data.movFiles} />}
        openModal={onView}
        setCloseModal={() => setOnView(false)}
      />
      <Modal
        title="Return"
        okHid={true}
        width={600}
        children={
          <NotifyList
            fieldPushkey={fieldPushkey}
            setOnNotify={setOnNotify}
            query={data.query}
            pushKey={data.pushKey}
            notify={data.notice && data.notice}
            setIndicatorList={setIndicatorList}
            indicatorList={indicatorList}
            response={data.answer}
          />
        }
        openModal={onNotify}
        setCloseModal={() => setOnNotify(false)}
      />
      <Modal
        onFunction={() => handleUpdateStatue(data.pushKey, data.status)}
        title={`Mark ${
          !data.status ? `"Reviewed"` : `"Pending"`
        } this indicator`}
        width={400}
        children={<CheckIndicator />}
        openModal={onCheck}
        setCloseModal={() => setOnCheck(false)}
      />
    </Layout>
  );
};

export default IndicatorItem;
