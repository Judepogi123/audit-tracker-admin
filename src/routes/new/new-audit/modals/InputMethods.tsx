import React from "react";
import { Typography, Layout } from "antd";

import { BsInputCursorText } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { MdOutlineRateReview } from "react-icons/md";
import { RiCheckboxMultipleFill } from "react-icons/ri";
import { MdRadioButtonChecked } from "react-icons/md";

import { FieldProps } from "../AddAudit";
import { MessageType } from "antd/es/message/interface";

interface MethodProps {
  title: string;
  type?: string;
  icon?: React.ReactNode;
}

interface Option {
  fieldID: string | undefined;
  fields: FieldProps[];
  value: string | number;
  label: string;
  selectedField: string | undefined;
  fieldType?: string;
  handleUpdateEntity: (
    list: FieldProps[],
    id: string | undefined,
    updateInfo?: string | React.ReactNode | React.ReactNode[],
    type?: string,
    value?: MethodProps[]
  ) => FieldProps[] | MessageType;
}

const methodList: MethodProps[] = [
  {
    title: "Single Selection",
    type: "radio_button",
    icon: <MdRadioButtonChecked />,
  },
  {
    title: "Multiple Selection",
    type: "check_box",
    icon: <RiCheckboxMultipleFill />,
  },
  { title: "Numerical", type: "number", icon: <BsInputCursorText /> },
  { title: "Rating", type: "rate", icon: <MdOutlineRateReview /> },
  { title: "Date", type: "date", icon: <MdDateRange /> },
];

const InputMethods = ({ fieldID, handleUpdateEntity, fields }: Option) => {
  return (
    <Layout
      style={{
        width: "200px",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      {methodList.map((item) => (
        <div
          onClick={() => handleUpdateEntity(fields, fieldID, "indicators",item.type)}
          className="method-item"
          style={{
            width: "100%",
            height: "30px",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <div>{item.icon}</div>
          <div>{item.title}</div>
        </div>
      ))}
    </Layout>
  );
};

export default InputMethods;
