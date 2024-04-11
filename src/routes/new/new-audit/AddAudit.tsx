import React, { ReactNode, useState, useReducer, useId } from "react";
import { Layout, Typography } from "antd";

import { v4 as genUid } from "uuid";

import { LuLayoutPanelTop } from "react-icons/lu";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { VscOpenPreview } from "react-icons/vsc";
import { VscListSelection } from "react-icons/vsc";
import { MdOutlineDescription } from "react-icons/md";
import { GiChoice } from "react-icons/gi";
import { MdOutlineSubtitles } from "react-icons/md";
import { IoStopCircleOutline } from "react-icons/io5";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { MdOutlinePermMedia } from "react-icons/md";
import { BsInputCursorText } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { MdOutlineRateReview } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import CloseOutlined from "@ant-design/icons";
import { VscClearAll } from "react-icons/vsc";

import { MdOutlineFullscreen } from "react-icons/md";
import { MdOutlineFullscreenExit } from "react-icons/md";
import "./style.scss";

import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";
import RadioButton from "../../../components/RadioButton";
import Input from "../../../components/Input";
import Textarea from "../../../components/Textarea";
import Popover from "../../../components/Popover";
import DropDown from "../../../components/DropDown";
import Modal from "../../../components/Modal";
import InputMethods from "./modals/InputMethods";

import { message } from "antd";
import type { MenuProps, Divider } from "antd";
import { ColorFormat } from "antd/es/color-picker/interface";
import { MessageType } from "antd/es/message/interface";

type MovType = "any" | "pic" | "docs" | "pdf" | "excel";

interface PanelProps {
  title: string;
  icon?: React.ReactNode;
  function: string;
}
interface MethodProps {
  title: string | undefined;
  type?: string;
  icon?: React.ReactNode;
  id?: string;
}

export interface FieldProps {
  id: string;
  title?: boolean | string;
  description?: boolean | string;
  fields?: FieldProps[];
  extend?: boolean;
  indicators?: FieldProps[];
  type?: "field" | "methods" | "title" | "description";
  mov?: "any" | "pic" | "docs" | "pdf" | "excel";
  dataInputMethod?: {
    type: string;
    value: MethodProps[];
  };
}

interface IndicatorProps {
  title?: string;
  description?: string;
  mov?: MovType;
}

interface SelectedProps {
  id: string;
}

const handleAddField = () => {
  const newFileds: FieldProps = {
    id: genUid(),
    title: false,
    description: "",
    extend: false,
    indicators: [],
    fields: [],
    type: "field",
  };
  return newFileds;
};

const handleAddSubField = () => {};

const handleAddIndicators = (type: string, values: MethodProps[]) => {
  const newIndicator: FieldProps = {
    description: "",
    title: "",
    mov: "any",
    id: genUid(),
    type: "title",
    dataInputMethod: {
      type: type,
      value: values,
    },
  };
  return newIndicator;
};

const handleAddDesciptions = () => {};

const handleSelectMany = () => {};

const handlePreview = () => {};

let ids = genUid();

const list = [
  { ids: { name: "dasdsa", id: ids } },
  { ids: { name: "dasdsa", id: ids } },
  { ids: { name: "dasdsa", id: ids } },
];
console.log(list);

const panels: PanelProps[] = [
  {
    title: "Add Field",
    icon: <IoIosAdd fontSize={20} />,
    function: "field",
  },
  {
    title: "Title",
    icon: <MdOutlineSubtitles fontSize={20} />,
    function: "title",
  },
  {
    title: "Descriptions",
    icon: <MdOutlineDescription fontSize={20} />,
    function: "description",
  },
  {
    title: "Data Input methods",
    icon: <GiChoice fontSize={20} />,
    function: "handleAddIndicator",
  },
  {
    title: "Means of Verification",
    icon: <MdOutlinePermMedia fontSize={20} />,
    function: "indicators",
  },
  {
    title: "Require",
    icon: <IoStopCircleOutline fontSize={20} />,
    function: "handlePreview",
  },
  {
    title: "Select",
    icon: <VscListSelection fontSize={20} />,
    function: "handleSelectMany",
  },
  {
    title: "Preview",
    icon: <VscOpenPreview fontSize={20} />,
    function: "handlePreview",
  },
  {
    title: "Clear all fields",
    icon: <VscClearAll fontSize={20} />,
    function: "handleClearFields",
  },
];

const indicatorsList = [
  {
    key: "1",
    label: (
      <div className="indicator-items">
        <p>Single Selection</p>
        <MdOutlineRadioButtonChecked fontSize={20} />
      </div>
    ),
  },
];

const validMenu = indicatorsList.map((item) => ({
  key: item.key,
  label: item.label,
}));

const AddAudit = () => {
  const [extend, setExtend] = useState<boolean>(true);
  const [fields, setFields] = useState<FieldProps[]>([]);
  const [selectetDataInputs, setSelectetDataInputs] = useState<
    string | undefined
  >(undefined);

  const [clearFields, setClearFields] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<SelectedProps | undefined>(
    undefined
  );

  const [messageApi, contextHolder] = message.useMessage();

  const handleAddMoreFields = () => {
    const newField = handleAddField();
    setFields([...fields, newField]);
  };

  const handleClearFields = () => {
    setFields([]);
    setClearFields(false);
    setSelectedField(undefined);
  };

  const handleConfirmClearFields = () => {
    if (fields.length < 1) {
      return;
    }
    setClearFields(true);
  };

  console.log(fields);

  const handleUpdateEntity = (
    list: FieldProps[],
    id: string | undefined,
    updateInfo?: string | React.ReactNode | React.ReactNode[],
    type?: string,
    value?: MethodProps[],
    valueID?: string
  ) => {
    if (!id || selectedField?.id !== id) {
      return messageApi.open({
        type: "warning",
        content: "Select a field first!",
      });
    }

    const listCopy = [...list];

    const walk = (obj: FieldProps) => {
      if (obj.id === id) {
        if (updateInfo === "title") {
          obj.title = "Type title here";
          return;
        }
        if (updateInfo === "field") {
          const newField = handleAddField();
          obj.fields?.push(newField);
          return;
        }
        if (updateInfo === "description") {
          obj.description = true;
          return;
        }
        if (updateInfo === "indicators") {
          const newIndicator = handleAddIndicators(type as string, value ?? []);
          obj.indicators?.push(newIndicator);
          return;
        }
        if (updateInfo === "indicatorsItem" && obj.indicators) {
          for (let item of obj.indicators) {
            if (item.id === valueID && item.dataInputMethod?.value) {
              const newItem: MethodProps = {
                title: "try",
                id: genUid(),
              };
              item.dataInputMethod.value.push(newItem);
            }
          }
        }
      }
      if (obj.fields) {
        obj.fields.forEach((item) => walk(item as unknown as FieldProps));
      }
      if (obj.indicators) {
        obj.indicators.forEach((item) => walk(item as unknown as FieldProps));
      }
    };

    list.forEach(walk);

    return listCopy;
  };

  const functionProvider = (method: string) => {
    if (method === "field") {
      if (fields.length < 1 || !selectedField?.id) {
        return handleAddMoreFields();
      } else {
        return handleUpdateEntity(fields, selectedField?.id, "field");
      }
    } else if (method === "handleClearFields") {
      return handleConfirmClearFields();
    } else if (method === "title") {
      return handleUpdateEntity(fields, selectedField?.id, "title");
    } else if (method === "description") {
      return handleUpdateEntity(fields, selectedField?.id, "description");
    } else if (method === "indicators") {
      return handleUpdateEntity(fields, selectedField?.id, "indicators");
    }
  };

  const handleAddIndicator = () => {};

  const handleSelectEntity = (id: string) => {
    setSelectedField({ id });
  };

  const searchDataById = (
    fields: FieldProps[],
    id: string,
    propsToRemove: string,
    itemID?: string,
    valueID?: string
  ): FieldProps[] => {
    const updatedFields = fields.map((field) => {
      if (field.id === id && propsToRemove === "field") {
        return undefined;
      }
      if (field.id === id && propsToRemove === "title") {
        field.title = false;
      }
      if (field.id === id && propsToRemove === "description") {
        field.description = false;
      }
      if (field.id === id && propsToRemove === "indicators") {
        return undefined;
      }

      if (
        field.id === id &&
        propsToRemove === "indicatorsItem" &&
        field.indicators
      ) {
        const updatedIndicators = field.indicators.map((indicator) => {
          if (indicator.id === itemID && indicator.dataInputMethod?.value) {
            indicator.dataInputMethod.value =
              indicator.dataInputMethod.value.filter(
                (item) => item.id !== valueID
              );
          }
          return indicator;
        });
        field.indicators = updatedIndicators;
      }

      // Recursively search through the 'fields' array (if present)
      if (field.fields) {
        field.fields = searchDataById(
          field.fields,
          id,
          propsToRemove,
          itemID,
          valueID
        );
      }

      // Recursively search through the 'indicators' array (if present)
      if (field.indicators) {
        field.indicators = searchDataById(
          field.indicators,
          id,
          propsToRemove,
          itemID,
          valueID
        );
      }

      // Return the field if it's not removed
      return field;
    });

    return updatedFields.filter((field) => field !== undefined) as FieldProps[];
  };

  const handleSearchAndDelete = (
    id: string,
    propsToRemove: string,
    itemKey?: string,
    valueID?: string
  ) => {
    const newFields = searchDataById(
      fields,
      id,
      propsToRemove,
      itemKey,
      valueID
    );
    setFields(newFields);
  };

  return (
    <Layout
      onClick={() => setSelectedField(undefined)}
      className="main-layout"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {contextHolder}
      <div
        style={{
          width: "100%",
          height: "12%",
          display: "flex",
          justifyContent: "flex-end",
          position: "sticky",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "auto",
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            backgroundColor: "#f8f9fa",
            padding: "10px 5px",
            transition: "width .3s ease-in-out",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Typography.Text style={{ fontSize: ".8rem" }}>
              Selected field: {selectedField?.id}
            </Typography.Text>
            <IoIosClose
              style={{ display: selectedField?.id ? "block" : "none" }}
              onClick={() => {
                setSelectedField(undefined);
              }}
              fontSize={25}
            />
            <CloseOutlined size={20} />
          </div>
          <div style={{ width: "auto", display: "flex" }}>
            {/* <div
              style={{
                display: extend ? "flex" : "none",
                cursor: "pointer",
                alignItems: "center",
              }}
              onClick={handleExtend}
            >
              {extend && (
                <BsChevronCompactRight color="#4a5759" fontSize={25} />
              )}
            </div> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
              }}
            >
              {panels.map((item, index) => (
                <>
                  {item.title === "Data Input methods" ? (
                    <Popover
                      content={
                        <InputMethods
                          fieldID={selectedField?.id}
                          fields={fields}
                          value={""}
                          label={""}
                          selectedField={undefined}
                          handleUpdateEntity={handleUpdateEntity}
                        />
                      }
                      placement="bottom"
                    >
                      <div
                        className="panel-items"
                        key={index}
                        style={{
                          width: "auto",
                          padding: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <div>{item.title}</div>
                        <div>{item.icon}</div>
                      </div>
                    </Popover>
                  ) : (
                    <div
                      className="panel-items"
                      key={index}
                      style={{
                        width: "auto",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => functionProvider(item.function)}
                    >
                      <>
                        <>{item.icon}</>
                        <div>
                          <p>{item.title}</p>
                        </div>
                      </>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fields-container">
        {fields.map((field, index) => (
          <Field
            fields={fields}
            index={index}
            handleSearchAndDelete={handleSearchAndDelete}
            handleSelectEntity={handleSelectEntity}
            data={field}
            selectedField={selectedField}
          ></Field>
        ))}
      </div>
      <Modal
        children={"Confirmn clear fields"}
        openModal={clearFields}
        setCloseModal={() => setClearFields(false)}
        onFunction={handleClearFields}
        width={250}
      />
    </Layout>
  );
};

export default AddAudit;

const Field = ({
  fields,
  data,
  selectedField,
  handleSelectEntity,
  handleSearchAndDelete,
  index,
}: {
  fields: FieldProps[];
  data: FieldProps;
  selectedField?: SelectedProps;
  handleSelectEntity: (id: string) => void;
  handleSearchAndDelete: (
    id: string,
    propsToRemove: string,
    itemKey?: string,
    valueID?: string
  ) => void;
  index: number;
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    handleSelectEntity(data.id);
  };

  const dataInputNameProvider = (value: string | undefined) => {
    switch (value) {
      case "radio_button":
        return "Single Selection";
      case "check_box":
        return "Multiple Selection";
      case "number":
        return "AlphaNumeric";
      case "rate":
        return "Rating";
      case "date":
        return "Date";
    }
  };

  const handleUpdateEntity = (
    list: FieldProps[],
    id: string | undefined,
    updateInfo?: string | React.ReactNode | React.ReactNode[],
    fieldID?: string,
    type?: string,
    value?: MethodProps[],
    valueID?: string
  ) => {
    console.log("List", list);
    console.log("FieldID", fieldID);

    console.log("clicked");

    const listCopy = [...list];

    const walk = (obj: FieldProps) => {
      if (obj.id === id) {
        if (updateInfo === "title") {
          obj.title = "Type title here";
          return;
        }
        if (updateInfo === "field") {
          const newField = handleAddField();
          obj.fields?.push(newField);
          return;
        }
        if (updateInfo === "description") {
          obj.description = true;
          return;
        }
        if (updateInfo === "indicators") {
          const newIndicator = handleAddIndicators(type as string, value ?? []);
          obj.indicators?.push(newIndicator);
          return;
        }
        if (updateInfo === "indicatorsItem" && obj.indicators) {
          console.log("Click here 2", obj.indicators);
          for (let item of obj.indicators) {
            if (item.id === fieldID) {
              console.log("Click here 3");
              const newItem: MethodProps = {
                title: "try",
                id: genUid(),
              };
              console.log(newItem);

              item?.dataInputMethod?.value.push(newItem);
            }
          }
        }
      }
      if (obj.fields) {
        obj.fields.forEach((item) => walk(item as unknown as FieldProps));
      }
      if (obj.indicators) {
        obj.indicators.forEach((item) => walk(item as unknown as FieldProps));
      }
    };

    list.forEach(walk);

    return listCopy;
  };

  const handleChangeStringProps = (
    fields: FieldProps[],
    fieldID: string,
    type: string,
    indicatorType: string,
    indicatorID: string,
    valueID: string,
    valueType: string,
    value: string 
  ) => {

    const newList = [...fields]

    const walk = (obj: FieldProps)=>{
      if(obj.id === fieldID && obj.indicators){
        for(let indicator of obj.indicators){
          if(indicator.id === indicatorID && indicator.dataInputMethod?.value){
            for(let valueItem of indicator.dataInputMethod.value){
              if(valueItem.id === valueID){
                valueItem.title = value
              }
              return valueItem
            }
          }
          return indicator
        }
      }
    }

    newList.forEach(walk)
    return newList
  };

  const hanleRenderDataInputMethods = (
    type: string | undefined,
    itemID: string,
    indicatorValue: MethodProps[] | undefined,
    fieldID: string,
    count: number
  ) => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          borderRadius: "3px",
          padding: "5px",
          gap: "5px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              padding: "3px",
            }}
          >
            <Typography.Text style={{ fontWeight: "bold" }}>
              Data input type:{" "}
            </Typography.Text>
            <Typography.Text>{dataInputNameProvider(type)}</Typography.Text>

            <Tooltip enterDelay={1} title="Remove">
              <IoIosClose
                onClick={() => handleSearchAndDelete(itemID, "indicators")}
                fontSize={25}
              />
            </Tooltip>

            <Tooltip enterDelay={1} title={`Add options`}>
              <IoMdAddCircleOutline
                onClick={() =>
                  handleUpdateEntity(fields, fieldID, "indicatorsItem", itemID)
                }
                fontSize={20}
              />
            </Tooltip>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ width: "100px" }}>
            <Typography.Text>Query: </Typography.Text>
          </div>
          <Textarea placeholder="Type query here" />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginTop: "10px",
          }}
        >
          {indicatorValue &&
            indicatorValue.map((item, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                className="indicator-value-item"
              >
                <RadioButton style={{ width: "100%" }} value={item.title}>
                  <Input
                    onChange={(e) => console.log(e.target.value)}
                    value={item.id}
                    style={{ width: "100%" }}
                    size={"small"}
                    placeholder={"Type here"}
                    variant="borderless"
                  />
                </RadioButton>
                <Tooltip enterDelay={1.5} title={`Remove this option`}>
                  <MdDelete
                    className="delete-icon"
                    onClick={() =>
                      handleSearchAndDelete(
                        fieldID,
                        "indicatorsItem",
                        itemID,
                        item.id
                      )
                    }
                    fontSize={20}
                  />
                </Tooltip>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={(event) => handleClick(event)}
      className="field-item"
      style={{
        width: "100%",
        backgroundColor: selectedField?.id === data.id ? "#e9ecef" : "",
        cursor: "pointer",
        padding: "5px",
        margin: "5px",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography.Text style={{ fontSize: ".6rem" }}>
          Field ID: {data.id}
        </Typography.Text>
        <IoIosClose
          onClick={() => handleSearchAndDelete(data.id, "field")}
          fontSize={25}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          gap: "5px",
          padding: "5px",
        }}
      >
        {data.title && (
          <div
            className="field-title"
            style={{
              width: "100%",
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100px" }}>
              <Typography.Text style={{ fontWeight: "bold" }}>
                Title:{" "}
              </Typography.Text>
            </div>

            <Input
              style={{ width: "auto", minWidth: "400px" }}
              size="small"
              placeholder="Type title here"
              variant="outlined"
            />
            <IoIosCloseCircleOutline
              onClick={() => handleSearchAndDelete(data.id, "title")}
            />
          </div>
        )}
        {data.description && (
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100px" }}>
              <Typography.Text style={{ fontWeight: "bold" }}>
                Descriptions:{" "}
              </Typography.Text>
            </div>
            <Textarea
              style={{ width: "auto", minWidth: "400px" }}
              placeholder="Type title here"
            />
            <IoIosCloseCircleOutline
              onClick={() => handleSearchAndDelete(data.id, "description")}
            />
          </div>
        )}
      </div>
      <div
        style={{
          display:
            data.indicators && data.indicators.length > 0 ? "flex" : "none",
          width: "100%",
          height: "auto",
          flexDirection: "column",
          gap: "5px",
          padding: "0px 5px 0px 20px",
        }}
      >
        {data.indicators &&
          data.indicators.map((item, index) =>
            hanleRenderDataInputMethods(
              item.dataInputMethod?.type,
              item.id,
              item.dataInputMethod?.value,
              data.id,
              index
            )
          )}
      </div>
      <div
        style={{
          display:
            data.indicators && data.indicators.length > 0 ? "flex" : "none",
          flexDirection: "column",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          padding: "0px 5px 0px 10px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: data.fields && data.fields.length > 0 ? "flex" : "none",
            justifyContent: "flex-start",
            fontSize: "1.2rem",
            fontWeight: "normal",
          }}
        >
          <Typography.Text>Fields</Typography.Text>
        </div>
        {data.fields &&
          data.fields.map((field) => (
            <Field
              fields={fields}
              index={index}
              handleSearchAndDelete={handleSearchAndDelete}
              key={field.id}
              data={field}
              selectedField={selectedField}
              handleSelectEntity={handleSelectEntity}
            />
          ))}
      </div>
    </div>
  );
};
