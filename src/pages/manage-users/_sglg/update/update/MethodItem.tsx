import React from "react";

import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input";
import Radio from "../../../../../components/Radio";
import RadioButton from "../../../../../components/RadioButton";
import Checkbox from "../../../../../components/Checkbox";
import Textarea from "../../../../../components/Textarea";

import {
  Layout,
  Typography,
  Radio as MRadio,
  Flex,
  RadioChangeEvent,
} from "antd";

import { CiCircleRemove } from "react-icons/ci";

interface RequirementsProp {
  condition: string;
  value: { id: string; query: string; status: boolean }[];
}

interface ValueProps {
  title: string;
  key: string;
}

interface MethodItemProps {
  id?: string;
  methodType: string | null;
  field?: FieldProps;
  items: IndicatorsProps;
  handleUpdateMethodType: (id: string, data: string, index: number) => void;
  handleRemoveIndicatorValue: (id: string, itemID: string) => void;
  handleEditValueTitle: (
    id: string,
    itemID: string,
    type: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleUpdateAlphanumeric: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
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
  title: string;
  type: "indicator" | "subIndicator";
  subIndicator?: IndicatorsProps[];
  stage: number;
  marked: boolean;
}

interface FieldProps {
  id: string;
  title: string;
  type: string;
  dependencies: { method: string; value: number };
  description: string;
  requirements: RequirementsProp[];
  indicators: IndicatorsProps[];
}

const MethodItem = ({
  id,
  methodType,
  field,
  items,
  handleRemoveIndicatorValue,
  handleEditValueTitle,
  handleUpdateMethodType,
  handleUpdateAlphanumeric,
}: MethodItemProps) => {
  const handleDefinemethod = (value: string) => {
    if (value.includes("%")) {
      return "%";
    } else if (value.includes("₱")) {
      return "₱";
    } else if (value.includes("0")) {
      return "0";
    } else {
      return "0";
    }
  };

  const handleDefineCondition = (value: string) => {
    if (value.includes("null")) {
      return "null";
    } else if (value.includes("min")) {
      return "min";
    } else if (value.includes("max")) {
      return "max";
    } else if (value.includes("equal")) {
      return "equal";
    } else {
      return "null";
    }
  };

  if (methodType === "radio_button") {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {Array.isArray(items.dataInputMethod.value) &&
          items.dataInputMethod.value.map((item, index) => (
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                padding: "3px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Radio value={item.key} children={undefined}></Radio>
                <Textarea
                  value={item.title}
                  style={{ width: "100%", maxHeight: "80px" }}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) =>
                    handleEditValueTitle(item.key, items.id, items.type, e)
                  }
                />
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveIndicatorValue(item.key, items.id)}
              >
                <CiCircleRemove fontSize={25} />
              </div>
            </div>
          ))}
      </div>
    );
  }
  if (methodType === "check_box") {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {Array.isArray(items.dataInputMethod.value) &&
          items.dataInputMethod.value.map((item, index) => (
            <div
              key={item.key}
              style={{
                width: "100%",
                height: "auto",
                display: "flex",

                padding: "3px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Checkbox></Checkbox>
                <Textarea
                  value={item.title}
                  style={{ width: "100%", maxHeight: "80px" }}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) =>
                    handleEditValueTitle(item.key, items.id, items.type, e)
                  }
                />
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveIndicatorValue(item.key, items.id)}
              >
                <CiCircleRemove fontSize={25} />
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (methodType?.includes("num")) {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "5px",
            padding: "3px 20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100px" }}>
              <Typography.Text style={{ width: "100%" }}>Type:</Typography.Text>
            </div>
            <MRadio.Group
              value={handleDefinemethod(items.dataInputMethod.type as string)}
              onChange={(e: RadioChangeEvent) =>
                handleUpdateMethodType(items.id, e.target.value, 2)
              }
              defaultValue="0"
              buttonStyle="solid"
            >
              <RadioButton value="0" children={"Default"} />
              <RadioButton value="%" children={"Percentage (%)"} />
              <RadioButton value="₱" children={"Currency Value (₱)"} />
            </MRadio.Group>
          </div>

          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <div style={{ width: "100px" }}>
              <Typography.Text style={{ width: "100%" }}>
                Value:
              </Typography.Text>
            </div>
            <Input
              value={items.dataInputMethod.value as string}
              onChange={(e) => handleUpdateAlphanumeric(items.id, e)}
              disabled={items.dataInputMethod.type?.includes(":0")}
              style={{ width: "200px" }}
              size={"small"}
              placeholder={"Type value"}
              variant={"outlined"}
            />
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100px" }}>
              <Typography.Text style={{ width: "100%" }}>
                Condition:
              </Typography.Text>
            </div>
            <MRadio.Group
            value={handleDefineCondition(items.dataInputMethod.type as string)}
              disabled={items.dataInputMethod.type?.includes(":0")}
              onChange={(e: RadioChangeEvent) =>
                handleUpdateMethodType(items.id, e.target.value, 1)
              }
              defaultValue="null"
              buttonStyle="solid"
            >
              <RadioButton value="null" children={"None"} />
              <RadioButton value="min" children={"Min"} />
              <RadioButton value="max" children={"Max"} />
              <RadioButton value="equal" children={"Equal"} />
            </MRadio.Group>
          </div>
        </div>
      </div>
    );
  }
  if (methodType === "date") {
    return (
      <Typography.Text style={{ fontStyle: "italic" }}>
        (The user can input date.)
      </Typography.Text>
    );
  }
  if (methodType?.includes("str")) {
    return (
      <Typography.Text style={{ fontStyle: "italic" }}>
        (The user can input text.)
      </Typography.Text>
    );
  }
};

export default MethodItem;
