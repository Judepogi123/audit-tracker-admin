import React from "react";
import type { CheckboxProps } from "antd";
import {
  DeleteOutlined,
  PlusCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";
import { Empty } from "antd";

import { v4 as genID } from "uuid";

import Layout from "../../../../../components/Layout";
import Checkbox from "../../../../../components/Checkbox";
import Select from "../../../../../components/Select";
import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input";

import { requirementConditions } from "./dataSourse";
import { FieldProps } from "../../../../../interface/manage";

import { Typography } from "antd";

interface RequirementsProp {
  condition: string;
  value: { id: string; query: string; status: boolean }[];
}

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
  title: string;
  type: "indicator" | "subIndicator";
  subIndicator?: IndicatorsProps[];
  stage: number;
  status: boolean;
  marked: boolean
}


interface RequirementsProps {
  field: FieldProps;
  setField: React.Dispatch<React.SetStateAction<FieldProps | null>>;
}

const Requirements = ({ field, setField }: RequirementsProps) => {
  const newField = field.indicators.filter((item) => item.query !== "");

  const handleFilterExistingRequirements = () => {
    if (!newField) return;
  };

  const handleNewRequirements = () => {
    const newRequirement: RequirementsProp = {
      condition: "any",
      value: [],
    };
    const updatedField = field.requirements
      ? [...field.requirements, newRequirement]
      : [newRequirement];
    setField({ ...field, requirements: updatedField });
  };

  const handleChangeCondition = (index: number, value: string) => {
    const updatedRequirements = [...field.requirements];
    updatedRequirements[index].condition = value;
    updatedRequirements[index].value = [];
    setField({ ...field, requirements: updatedRequirements });
  };

  const handleModifyCondition = (
    index: number,
    value: string,
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const updatedRequirements = [...field.requirements];
    const matchedIndex = updatedRequirements[index].value.findIndex(
      (item) => item.id === id
    );
    if (matchedIndex !== -1) {
      updatedRequirements[index].value[matchedIndex].query = e.target.value;
    }
    setField({ ...field, requirements: updatedRequirements });
  };

  const handleRemoveRequirements = (index: number) => {
    const updatedRequirements = field.requirements.filter(
      (_, i) => i !== index
    );
    setField({ ...field, requirements: updatedRequirements });
  };

  const handleWatchRequirementsValue = (index: number, id: string): boolean => {
    if (!field || !Array.isArray(field.requirements)) return false;

    const matchedItem = field.requirements.find((_, i) => i === index);

    if (matchedItem && matchedItem.value) {
      const matchedValue = matchedItem.value.find((value) => value.id === id);
      return !!matchedValue?.status && matchedValue.status;
    }

    return false;
  };

  const handleNewModifyCondition = (index: number) => {
    if (!field || !Array.isArray(field.requirements)) return false;
    const updatedRequirements = [...field.requirements];

    updatedRequirements[index].value.push({
      id: genID(),
      query: "",
      status: false,
    });

    setField({ ...field, requirements: updatedRequirements });
  };

  const handleRemoveModifyCondition = (index: number, id: string) => {
    if (!field || !Array.isArray(field.requirements)) return false;
    const updatedRequirements = [...field.requirements];

    updatedRequirements[index].value = updatedRequirements[index].value.filter(
      (item) => item.id !== id
    );

    setField({ ...field, requirements: updatedRequirements });
  };

  const handleCheckIfExisting = (
    index: number,
    id: string,
    query: string,
    status: boolean
  ) => {
    if (!field || !Array.isArray(field.requirements)) return;
  
    const updatedRequirements = field.requirements.map((item, i) => {
      if (i === index) {
        const matchedItem = item.value.find((item) => item.id === id);
        if (matchedItem !== undefined) {
          // Toggle the status if the item with the specified id exists
          matchedItem.status = !status;
        } else {
          // Add a new item to the value array if the item doesn't exist
          item.value.push({ id: id, query: query, status: false });
        }
      } else {
        // Set status to false for items with different indices
        item.value.forEach((val) => {
          if (val.id === id) {
            val.status = false;
          }
        });
      }
      return item;
    });
  
    setField({ ...field, requirements: updatedRequirements });
  };
  

  return (
    <Layout
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "450px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Typography.Title level={5}>Requirements</Typography.Title>
        <Button
          onClick={() => handleNewRequirements()}
          icon={<PlusCircleFilled />}
        >
          New
        </Button>
      </div>
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          overflow: "auto",
        }}
      >
        {field.requirements.map((item, index) => (
          <div
            key={index}
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              gap: "5px",
              alignItems: "center",
              flexDirection: "column",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid black",
              backgroundColor: "#fffcf2",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
          >
            <div style={{ width: "100%", display: "flex" }}>
              <Typography.Title level={5} style={{ width: "100px" }}>
                Condition:{" "}
              </Typography.Title>
              <Select
                value={item.condition}
                onChange={(value: string) => handleChangeCondition(index, value)}
                defaultValue="any"
                options={requirementConditions}
                style={{ width: "100%" }} size={undefined}              />

              <div
                style={{ width: "auto", padding: "3px", cursor: "pointer" }}
                onClick={() => handleRemoveRequirements(index)}
              >
                <DeleteOutlined />
              </div>
            </div>
            {item.condition.includes("modify:") && (
              <div
                style={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                {item.value.map((val, count) => (
                  <div
                    key={val.id}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <div>
                      <Typography.Text>{count + 1}</Typography.Text>
                    </div>
                    <Input
                      onChange={(e) =>
                        handleModifyCondition(index, item.condition, e, val.id)
                      }
                      size={"small"}
                      placeholder={"Type here"}
                      variant={"outlined"}
                    />
                    <div>
                      <CloseOutlined
                        onClick={() =>
                          handleRemoveModifyCondition(index, val.id)
                        }
                      />
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => handleNewModifyCondition(index)}
                  style={{
                    width: "100%",
                    borderRadius: "30px",
                    backgroundColor: "#59a5d8",
                    color: "#fff",
                  }}
                >
                  New modify conditon
                </Button>
              </div>
            )}
            {!item.condition.includes("modify:") && (
              <IndicatorList
                index={index}
                handleWatchRequirementsValue={handleWatchRequirementsValue}
                handleChangeCheckState={handleCheckIfExisting}
                indicators={newField}
              />
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Requirements;

const IndicatorList = ({
  indicators,
  handleChangeCheckState,
  handleWatchRequirementsValue,
  index,
}: {
  indicators: IndicatorsProps[];
  handleChangeCheckState: (
    index: number,
    id: string,
    query: string,
    status: boolean
  ) => void;
  handleWatchRequirementsValue: (index: number, id: string) => boolean;
  index: number;
}) => {
  return (
    <Layout
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "3px",
      }}
    >
      {indicators.length === 0 ? (
        <div
          style={{
            width: "100%",
            height: "auto",
            padding: "3px",
            display: "grid",
          }}
        >
          <div style={{ margin: "auto" }}>
            <Typography.Text>Empty (No indicators found!)</Typography.Text>
          </div>
        </div>
      ) : (
        indicators.map((item, dataIndex) => (
          <div
            onClick={() =>
              handleChangeCheckState(
                index,
                item.id,
                item.query,
                handleWatchRequirementsValue(index, item.id)
              )
            }
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              gap: "5px",
              cursor: "pointer",
              backgroundColor: handleWatchRequirementsValue(index, item.id)
                ? "#aec1ff"
                : "#fff",
              borderRadius: "5px",
              padding: "5px 10px",
              border: "1px solid #ccc",
            }}
          >
            <Typography.Text> {item.query}</Typography.Text>
          </div>
        ))
      )}
    </Layout>
  );
};
