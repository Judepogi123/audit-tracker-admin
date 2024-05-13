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
}

const Area = ({
  messageApi,
  selectedAudit,
  setArea,
  setSelectedArea,
  setSearchParams,
}: AreaSelectionProps) => {
  const [areasData, setAreaData] = useState<OptionProps[] | null>(null);
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

  useEffect(() => {
    const handleData = async () => {
      try {
        const cache = await handleGetLocal("areasList");
        let parsedCache: AreaProps[] | undefined;
        if (cache) {
          parsedCache = JSON.parse(cache as string);
        }

        const fetchedData: AreaProps[] = areas?.data || [];
        setArea(fetchedData);

        if (
          !parsedCache ||
          (selectedAudit &&
            JSON.stringify(
              parsedCache.filter((item) => item.auditKey === selectedAudit)
            ) !==
              JSON.stringify(
                fetchedData.filter((item) => item.auditKey === selectedAudit)
              ))
        ) {
          const filteredData = selectedAudit
            ? fetchedData.filter((item) => item.auditKey === selectedAudit)
            : fetchedData;
          const stringData = JSON.stringify(filteredData);
          await handleSaveLocal("areasList", stringData);
          setSelectedArea(filteredData[0].pushKey);
          let temp: { value: string; label: string }[] = [
            { label: "All", value: "all" },
          ];
          for (let item of fetchedData) {
            temp.push({ value: item.pushKey, label: item.title });
          }
          setAreaData(temp);
        } else {
          const cachedData = parsedCache?.filter(
            (item) => item.auditKey === selectedAudit
          );
          setAreaData(
            cachedData?.map((item) => ({
              label: item.title,
              value: item.pushKey,
            }))
          );
        }
      } catch (error) {
        setAreasError(error);
        messageApi.error(`Something went wrong with datas: ${error}`);
      }
    };

    handleData();
  }, [areas?.data, selectedAudit]);

  const handleChangeArea = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("area", value);
        return prev;
      },
      { replace: true }
    );
  };

  // Handle loading, error, and data states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (areasError) {
  //   return <div>Error fetching areas: {areasError.message}</div>;
  // }

  if (!areasData) {
    return null; // Or display a placeholder message
  }

  return (
    <Select
    defaultValue="all"
      onChange={handleChangeArea}
      disabled={isLoading}
      placeholder="Select area"
      loading={isLoading}
      options={areasData}
      size={undefined}
    />
  );
};

export default Area;
