import React, { useState, useId, useEffect } from "react";
import { v4 as genID } from "uuid";
import { useDebounce } from "use-debounce";
import axios from "../../../../../../server/api/axios";
import { useUserData } from "../../../../../provider/DataProvider";

import MethodItem from "./MethodItem";
import ConfirmSave from "./ConfirmSave";
import Requirements from "./Requirements";

import { useNavigate } from "react-router-dom";

import { Layout, Typography, message } from "antd";

import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input";
import Textarea from "../../../../../components/Textarea";
import Tooltip from "../../../../../components/Tooltip";
import Select from "../../../../../components/Select";
import Modal from "../../../../../components/Modal";
import Rsults from "../../../../../components/Rsults";

import "./style.scss";
import { dataInputMethod, mov } from "./dataSourse";
import FileTypeRenderer from "../../../../../utils/FileTypeRenderer";
import { handleManString } from "../../../../../utils/_global-functions";

import { IoMdAddCircleOutline } from "react-icons/io";
import { VscOpenPreview } from "react-icons/vsc";
import {
  PlusOutlined,
  DeleteOutlined,
  MinusSquareOutlined,
} from "@ant-design/icons";
import { MessageInstance } from "antd/es/message/interface";


interface RequirementsProps {
  condition: string;
  value: {id: string, query: string, status: boolean}[];
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
}

interface FieldProps {
  id: string;
  title: string;
  type: string;
  dependencies: { method: string; value: number };
  description: string;
  requirements: RequirementsProps[];
  indicators: IndicatorsProps[];
}

const handleCreateField = () => {
  const newField: FieldProps = {
    id: genID(),
    title: "",
    type: "",
    dependencies: {
      method: "",
      value: 0,
    },
    requirements: [],
    indicators: [],
    description: "",
  };
  return newField;
};

const handleCreatIndicator = (
  type: "indicator" | "subIndicator",
  count: number
) => {
  const newIndicator: IndicatorsProps = {
    dataInputMethod: {
      type: "null",
      value: [],
    },
    query: "",
    id: genID(),
    mov: "null",
    movDueDate: "null",
    title: "null",
    type: type,
    subIndicator: [],
    stage: count,
    status: false,
  };

  return newIndicator;
};

const handleButtonColorProvider = (stage: number) => {
  switch (stage) {
    case 0:
      return "#4a4fff";
    case 1:
      return "#7d80ff";
    case 2:
      return "#b0b2ff";
    default:
      return "#4a4fff";
  }
};

const NewField = () => {
  const [field, setField] = useState<FieldProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confimnSave, setConfirmnSave] = useState<boolean>(false);
  const [onRequire, setOnRequire] = useState<boolean>(false);
  const [result, setResult] = useState<string | undefined>();

  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const useData = useUserData();

  useEffect(() => {
    const newfield = handleCreateField();
    setField(newfield);
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field) {
      setField({ ...field, title: e.target.value });
    }
  };

  const handleAddIndicator = () => {
    if (field) {
      const newIndicator = handleCreatIndicator("indicator", 0);

      const updatedIndicators = field.indicators
        ? [...field.indicators, newIndicator]
        : [newIndicator];

      // Update the field state with the new array of indicators
      setField({ ...field, indicators: updatedIndicators });
    }
  };

  const handleRemoveIndicator = (id: string, type: string) => {
    if (!field) return;

    // Clone the current field state
    const newField: FieldProps = { ...field };

    const removeIndicatorById = (
      indicators: IndicatorsProps[]
    ): IndicatorsProps[] => {
      // Create a new array to store the modified indicators
      const newIndicators: IndicatorsProps[] = [];

      // Iterate over the indicators
      for (const indicator of indicators) {
        // Check if the current indicator matches the specified id
        if (indicator.id === id && indicator.type === type) {
          // Skip this indicator and its sub-indicators
          continue;
        }

        // Check if the current indicator has sub-indicators
        if (indicator.subIndicator) {
          // Recursively remove sub-indicators
          indicator.subIndicator = removeIndicatorById(indicator.subIndicator);
        }

        // Add the modified indicator to the new array
        newIndicators.push(indicator);
      }

      // Return the new array of indicators
      return newIndicators;
    };

    // Remove the specified indicator from the indicators list
    newField.indicators = removeIndicatorById(newField.indicators);

    // Update the state with the modified field object
    setField(newField);
  };

  const handleEditDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (field) {
      setField({ ...field, description: e.target.value });
    }
  };

  const handleValidateField = () => {
    if (!field) {
      return false;
    }

    if (!field.title || field.title === "" || field.title === null) {
      messageApi.warning("Field title is required.");

      return false;
    }

    if (
      !field.indicators ||
      field.indicators.length <= 0 ||
      field.indicators === null
    ) {
      messageApi.warning("Field indicator is required.");
      return false;
    }

    for (let indicator of field.indicators) {
      if (
        !indicator.query ||
        indicator.query === "" ||
        indicator.query === null
      ) {
        messageApi.warning("All indicators must have query.");
        return false;
      }
      if (indicator.subIndicator) {
        for (let subIndicator of indicator.subIndicator) {
          if (
            !subIndicator.query ||
            subIndicator.query === "" ||
            subIndicator.query === null
          ) {
            messageApi.warning("All indicators must have query.");
            return false;
          }

          if (subIndicator.subIndicator) {
            for (let subIndicatorSec of subIndicator.subIndicator) {
              if (
                !subIndicatorSec.query ||
                subIndicatorSec.query === "" ||
                subIndicatorSec.query === null
              ) {
                messageApi.warning("All indicators must have query.");
                return false;
              }
            }
          }
        }
      }
    }
    setConfirmnSave(true);
  };

  const handleSaveNewField = async () => {
    const status = handleValidateField();
    if (!status) {
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/data/new-field", {
        ...field,
        authorUsername: useData.userName,
        authorFullname: useData.userFullname,
      });
      if (response.data) {
        setResult(response.data.message);
        setIsLoading(false);
        setConfirmnSave(false);
        setField(null);
      }
    } catch (error) {
      messageApi.error(`Sorry, something went wrong; ${error}`)
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fffcf2",
      }}
    >
      {contextHolder}
      <div className="field-header">
        <Typography.Title level={3}>Add new field</Typography.Title>
        <div style={{ cursor: "pointer" }}>
          <VscOpenPreview fontSize={30} />
        </div>
      </div>
      <div className="new-field-content">
        <div
          className=""
          style={{
            width: "100%",
            padding: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography.Title level={5} style={{ width: "120px" }}>
            Title:{" "}
          </Typography.Title>
          <Input
            onChange={handleTitleChange}
            size="small"
            placeholder={"Field title here"}
            variant="outlined"
          />
        </div>
        <div
          style={{
            width: "100%",
            padding: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography.Title level={5} style={{ width: "120px" }}>
            Descriptions:{" "}
          </Typography.Title>
          <Textarea
            onChange={(e) => handleEditDescription(e)}
            style={{ maxHeight: "100px" }}
            placeholder={"Field description here (Optional)"}
          />
        </div>
        <div
          style={{
            width: "100%",
            padding: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography.Title level={5} style={{ width: "110px" }}>
            Requirements:{" "}
          </Typography.Title>
          <Button onClick={() => setOnRequire(true)}>View</Button>
        </div>
        <div className="indicator">
          <div className="indicator-header">
            <Typography.Title level={4}>Indicators</Typography.Title>
          </div>

          <div className="indicator-content">
            {field?.indicators &&
              field.indicators.map((item, index) => (
                <IndicatorField
                  messageApi={messageApi}
                  item={item}
                  index={index}
                  handleRemoveIndicator={handleRemoveIndicator}
                  field={field}
                  setField={setField}
                />
              ))}
            <Button
              onClick={handleAddIndicator}
              icon={<PlusOutlined />}
              style={{ width: "100%" }}
            >
              New Indicator
            </Button>
          </div>
        </div>
      </div>
      <div className="field-footer">
        <Button onClick={() => navigate("/manage/update-audit")}>Cancel</Button>
        <Button
          loading={isLoading}
          onClick={handleValidateField}
          style={{ backgroundColor: "#00a8e8", color: "#fff" }}
        >
          Save
        </Button>
      </div>
      <Modal
        width={400}
        loading={isLoading}
        onFunction={handleSaveNewField}
        children={
          <ConfirmSave isLoading={isLoading} setIsLoading={setIsLoading} />
        }
        openModal={confimnSave}
        setCloseModal={() => setConfirmnSave(false)}
      />
      <Modal
      style={{maxHeight: "600px"}}
        width={800}
        children={
          <Requirements setField={setField} field={field as FieldProps} />
        }
        openModal={onRequire}
        setCloseModal={() => setOnRequire(false)}
      />
      {result === "success" && (
        <Rsults
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            margin: "auto",
            width: "600px",
            height: "400px",
            backgroundColor: "#fff",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            borderRadius: "5px",
            textAlign: "center",
            lineHeight: "100px",
          }}
          status={"success"}
          title="Successfully added new field."
          subTitle="You can now view the created field to the Audit info."
          extra={[
            <Button onClick={() => navigate("/manage/update-audit")}>
              Back to the field list
            </Button>,
          ]}
        />
      )}
    </Layout>
  );
};

export default NewField;

const IndicatorField = ({
  item,
  index,
  handleRemoveIndicator,
  field,
  setField,
  messageApi,
}: {
  item: IndicatorsProps;
  index: number;
  handleRemoveIndicator: (id: string, type: string) => void;
  field: FieldProps;
  setField: React.Dispatch<React.SetStateAction<FieldProps | null>>;
  messageApi: MessageInstance;
}) => {
  const handleChangeMethodType = (
    id: string,
    value: string,
    type: string | null
  ) => {
    const clonedField = { ...field };

    const walk = (obj: IndicatorsProps) => {
      if (obj.id === id) {
        if (obj.dataInputMethod.type === type) {
          obj.dataInputMethod.value = [];
        }
        obj.dataInputMethod.type = value;
        return;
      }
      if (obj.subIndicator) {
        obj.subIndicator.forEach((item) => walk(item));
      }
    };

    clonedField.indicators.forEach(walk);
    setField(clonedField);
  };

  const handleGetMethodType = (value: string | null) => {
    if (value === "check_box" || value === "radio_button") {
      return true;
    } else {
      return false;
    }
  };

  const handleAddSubIndicator = (id: string) => {
    const newList = { ...field };

    const walk = (obj: IndicatorsProps) => {
      if (obj.id === id) {
        if (obj.stage === 2) {
          messageApi.warning("Limit reached");
          return;
        }
        const count = obj.stage + 1;
        const newIndicator = handleCreatIndicator("subIndicator", count);
        obj.subIndicator?.push(newIndicator);
      }
      if (obj.subIndicator) {
        obj.subIndicator.forEach((item) => walk(item));
      }
    };

    newList.indicators?.forEach(walk);
    setField(newList as FieldProps);
  };

  const handleStageProvider = (stage: number) => {
    switch (stage) {
      case 0:
        return "#f6f6f6";
      case 1:
        return "#f6f6f6";
      case 2:
        return "#f6f6f6";
      default:
        return "#f6f6f6";
    }
  };

  const handleCountProvider = (stage: number, index: number) => {
    switch (stage) {
      case 0:
        return `A${index + 1}`;
      case 1:
        return `B${index + 1}`;
      case 2:
        return `C${index + 1}`;
      default:
        return index;
    }
  };

  const handleEditValueTitle = (
    id: string,
    itemID: string,
    type: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!field) return;

    const newField: FieldProps = { ...field };

    const editValueTitle = (indicators: IndicatorsProps[]) => {
      for (const indicator of indicators) {
        if (
          indicator.id === itemID &&
          indicator.type === type &&
          Array.isArray(indicator.dataInputMethod.value)
        ) {
          for (let item of indicator.dataInputMethod.value) {
            if (item.key === id) {
              item.title = e.target.value;
            }
          }
        }

        if (indicator.subIndicator) {
          editValueTitle(indicator.subIndicator);
        }
      }
    };

    editValueTitle(newField.indicators);
    setField(newField);
  };

  const handleEditQuery = (
    id: string,
    type: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!field) return;

    // Clone the current field state
    const newField: FieldProps = { ...field };

    const editIndicatorQuery = (indicators: IndicatorsProps[]): void => {
      for (const indicator of indicators) {
        if (indicator.id === id && indicator.type === type) {
          // Update the query of the matching indicator
          indicator.query = e.target.value;
          return;
        }
        // If the indicator has sub-indicators, recursively call this function
        if (indicator.subIndicator) {
          editIndicatorQuery(indicator.subIndicator);
        }
      }
    };

    // Call the helper function to edit the query
    editIndicatorQuery(newField.indicators);

    // Update the state with the modified field object
    setField(newField);
  };

  const handleAddOptions = (type: string, id: string) => {
    if (!field) return;
    const newField = { ...field };

    const searchEntity = (indicators: IndicatorsProps[]) => {
      for (const indicator of indicators) {
        if (
          indicator.id === id &&
          indicator.type === type &&
          Array.isArray(indicator.dataInputMethod.value)
        ) {
          // Push a new option to the array of values
          indicator.dataInputMethod.value.push({ title: "", key: genID() });
          // Update the field state
          setField({ ...newField });
          return;
        }

        if (indicator.subIndicator) {
          searchEntity(indicator.subIndicator);
        }
      }
    };

    searchEntity(newField.indicators);
  };

  const handleRemoveIndicatorValue = (id: string, itemID: string) => {
    if (!field) return;

    // Clone the current field state
    const newField: FieldProps = { ...field };

    const searchEntity = (indicators: IndicatorsProps[]) => {
      for (const indicator of indicators) {
        if (indicator.id === itemID) {
          // Check if the data input method value is an array
          if (Array.isArray(indicator.dataInputMethod.value)) {
            // Find the index of the item with the specified ID
            const indexToRemove = indicator.dataInputMethod.value.findIndex(
              (item) => item.key === id
            );
            if (indexToRemove !== -1) {
              // Remove the item from the array
              indicator.dataInputMethod.value.splice(indexToRemove, 1);
            }
          }
          break;
        }
        // If the indicator has sub-indicators, recursively call this function
        if (indicator.subIndicator) {
          searchEntity(indicator.subIndicator);
        }
      }
    };

    // Call the helper function to remove the value
    searchEntity(newField.indicators);

    // Update the state with the modified field object
    setField(newField);
  };

  const handleChangeMov = (id: string, value: string) => {
    if (!field) return;
    const newField = { ...field };

    const changeMov = (indicators: IndicatorsProps[]) => {
      for (const indicator of indicators) {
        if (indicator.id === id) {
          indicator.mov = value;
          return;
        }

        if (indicator.subIndicator) {
          changeMov(indicator.subIndicator);
        }
      }
    };

    changeMov(newField.indicators);
    setField(newField);
  };

  const handleUpdateMethodType = (id: string, data: string, index: number) => {
    if (!field) return;
    const newField = { ...field };

    const updateMethodType = (indicators: IndicatorsProps[]) => {
      for (const indicator of indicators) {
        if (indicator.id === id && indicator.dataInputMethod.type) {

          indicator.dataInputMethod.type = handleManString(
            indicator.dataInputMethod.type,
            data,
            index
          ) as string;
        }
        if (indicator.subIndicator) {
          updateMethodType(indicator.subIndicator);
        }
      }
    };

    updateMethodType(newField.indicators);

    setField(newField);
  };

  const handleUpdateAlphaNumberic = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!field) return;
    const newField = { ...field };

    const updateAlphaNumberic = (indicators: IndicatorsProps[]) => {
      for (const indicator of indicators) {
        if (indicator.id === id) {
          indicator.dataInputMethod.value = parseInt(e.target.value);
          return;
        }
        if (indicator.subIndicator) {
          updateAlphaNumberic(indicator.subIndicator);
        }
      }
    };

    updateAlphaNumberic(newField.indicators);

    setField(newField);
  };

  return (
    <div key={item.id} className="indicator-content-item">
      <div
        style={{ backgroundColor: handleStageProvider(item.stage) }}
        className="indicator-content-header"
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <div style={{ width: "20px" }}>
            <Typography.Text style={{ fontWeight: "bold" }}>
              {handleCountProvider(item.stage, index)}
            </Typography.Text>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography.Text style={{ width: "60px", fontWeight: "lighter" }}>
              Query:{" "}
            </Typography.Text>
            <Textarea
              style={{ maxHeight: "100px" }}
              value={item.query}
              onChange={(e) => handleEditQuery(item.id, item.type, e)}
              row={1}
              placeholder={"Type here"}
            />

            <div style={{ padding: "0px 10px", cursor: "pointer" }}>
              <Tooltip enterDelay={2} title="Remove indicator">
                <DeleteOutlined
                  onClick={() => handleRemoveIndicator(item.id, item.type)}
                />
              </Tooltip>
            </div>

            <div>
              <Tooltip enterDelay={2} title="Add sub-indicator">
                <div>
                  <Button
                    onClick={() => handleAddSubIndicator(item.id)}
                    style={{
                      width: "50px",
                      display: item.stage === 2 ? "none" : "block",
                      backgroundColor: handleButtonColorProvider(item.stage),
                      color: "#fff",
                    }}
                    icon={<PlusOutlined />}
                    children={undefined}
                  ></Button>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            padding: "5px",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography.Text style={{ width: "130px" }}>
            Data Input Method:
          </Typography.Text>
          <Select
          size="small"
            defaultValue="null"
            onChange={(value: string) =>
              handleChangeMethodType(item.id, value, item.dataInputMethod.type)
            }
            style={{ width: "200px" }}
            options={dataInputMethod}
          />
          {handleGetMethodType(item.dataInputMethod.type) ? (
            <Button
              onClick={() => handleAddOptions(item.type, item.id)}
              icon={<PlusOutlined />}
            >
              Add Option
            </Button>
          ) : null}
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            padding: "5px",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography.Text style={{ width: "130px" }}>
            Means of Verification:
          </Typography.Text>
          <Select
          size="small"
            defaultValue="null"
            onChange={(value: string) => handleChangeMov(item.id, value)}
            style={{ width: "200px" }}
            options={mov}
          />
          <FileTypeRenderer type={item.mov} />
        </div>

        {/* Selected Data input method */}
        <div
          style={{
            width: "100%",
            height: "auto",
            flexDirection: "column",
            backgroundColor: "#fff",
          }}
        >
          <MethodItem
            handleUpdateAlphanumeric={handleUpdateAlphaNumberic}
            handleUpdateMethodType={handleUpdateMethodType}
            handleEditValueTitle={handleEditValueTitle}
            handleRemoveIndicatorValue={handleRemoveIndicatorValue}
            id={""}
            methodType={item.dataInputMethod.type}
            field={field}
            items={item}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "10px 0px 5px 70px",
          }}
        >
          {item.subIndicator &&
            item.subIndicator.map((item, idx) => (
              <IndicatorField
                messageApi={messageApi}
                setField={setField}
                field={field}
                item={item}
                index={idx}
                handleRemoveIndicator={handleRemoveIndicator}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
