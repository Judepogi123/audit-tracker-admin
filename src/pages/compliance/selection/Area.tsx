import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";
import { handleGetLocal, handleSaveLocal } from "../../../utils/localStorage";

import Layout from "../../../components/Layout";
import Select from "../../../components/Select";

import { AreaProps, OptionProps } from "../../../interface/compliance";
import { FieldProps } from "../../../interface/manage";
import { MessageInstance } from "antd/es/message/interface";
import { SetURLSearchParams } from "react-router-dom";

interface AreaSelectionProps {
  messageApi: MessageInstance;
  selectedAudit: string | undefined;
  setArea: React.Dispatch<React.SetStateAction<AreaProps[] | undefined>>;
  setSelectedArea: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSearchParams: SetURLSearchParams;
  currentArea: string | null;
  handleChangeArea: (value: string) => void;
  currentAudit: string | null;
}

const Area = ({
  messageApi,
  selectedAudit,
  setArea,
  setSelectedArea,
  setSearchParams,
  currentArea,
  handleChangeArea,
  currentAudit,
}: AreaSelectionProps) => {
  const [areasData, setAreaData] = useState<OptionProps[] | null>(null);
  const [areasList, setAreaList] = useState<AreaProps[] | []>([]);
  const [areasError, setAreasError] = useState<unknown | null>(null);

  const {
    data: areas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: () => axios.get("/data/areas"),
    // Consider adding select: false if unnecessary for pagination/infinite scrolling
  });

  const hanldeGetArea = async () => {
    try {
      const parsedData: AreaProps[] = areas?.data;
      let temp: { value: string; label: string; majorID?: string }[] = [
        { value: "all", label: "All" },
      ];

      for (let item of Object.values(parsedData)) {
        temp.push({
          label: item.title,
          value: item.pushKey,
          majorID: item.auditKey,
        });
      }
      console.log(temp);

      setAreaData(temp);
      setAreaList(parsedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    hanldeGetArea();
  }, [areas?.data]);

  

  // const handleFilterArea = (): OptionProps[]=>{
  //   try {
  //     return []
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // Handle loading, error, and data states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {areasData && (
        <Select
          value={currentArea}
          style={{ width: "150px" }}
          defaultValue="all"
          onChange={handleChangeArea}
          disabled={isLoading}
          placeholder="Select area"
          loading={isLoading}
          options={areasData.filter(
            (item) => item.value === "all" && item.majorID === currentAudit
          )}
          size={undefined}
        />
      )}
    </>
  );
};

export default Area;
