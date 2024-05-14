import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";
import { handleGetLocal, handleSaveLocal } from "../../../utils/localStorage";

import { LocaleListProps, OptionProps } from "../../../interface/compliance";

import Layout from "../../../components/Layout";
import Select from "../../../components/Select";
import { MessageInstance } from "antd/es/message/interface";
import { handleDefineType } from "../../../utils/locale";

interface LocaleProps {
  messageApi: MessageInstance;
  setAllLocale: React.Dispatch<
    React.SetStateAction<LocaleListProps[] | []>
  >;
  currentAudit: string | null;
  handleChangeLocale: (value: string) => void;
  currentLocale: string | null
}

const Locale = ({ messageApi, setAllLocale,currentAudit,handleChangeLocale,currentLocale}: LocaleProps) => {
  const [localeData, setLocaleData] = useState<OptionProps[] | []>([])
  const allLocale = localStorage.getItem("localeList");
  const localeType = handleDefineType(currentAudit as string)

  useEffect(() => {
    const list: LocaleListProps[] = allLocale ? JSON.parse(allLocale as string) : [];
    let temp: { label: string; value: string; majorID?: string }[] = [
      { label: "All", value: "all" },
    ];
    for (let item of list) {
      temp.push({
        value: item.zipCode,
        label: item.municipalityName,
        majorID: item.type,
      });
    }
    setLocaleData(temp);
  }, [allLocale]);

  const [allLocalList, setLocaleList] = useState<OptionProps[] | []>([
    { label: "All", value: "all" },
  ]);
  const { data: localeList } = useQuery({
    queryKey: ["localeList"],
    queryFn: () => axios.get("/data/municipalities"),
  });

  // Combine data fetching and caching in a single useEffect
  useEffect(() => {
    const handleData = async () => {
      try {
        const cache = await handleGetLocal("localeList");
        let parsedCache: LocaleListProps[] | undefined;
        if (cache) {
          parsedCache = JSON.parse(cache as string);
        }

        const fetchedData: LocaleListProps[] = localeList?.data || [];
        setAllLocale(fetchedData); // Update complete locale list

        if (
          !parsedCache ||
          JSON.stringify(parsedCache) !== JSON.stringify(fetchedData)
        ) {
          const stringData = JSON.stringify(fetchedData);
          await handleSaveLocal("localeList", stringData);
          setLocaleList(
            fetchedData.map((item) => ({
              label: item.municipalityName,
              value: item.zipCode,
            }))
          );
        } else {
          setLocaleList(
            parsedCache.filter((item)=> item.type === handleDefineType(currentAudit as string)).map((item) => ({
              label: item.municipalityName,
              value: item.zipCode,
            }))
          );
        }
      } catch (error) {
        messageApi.error(`Something went wrong with data: ${error}`);
      }
    };

    handleData();
  }, [localeList?.data,currentAudit ]);

  return (
    <Select
    value={currentLocale || "all"}
    defaultValue={"all"}
    onChange={handleChangeLocale}
    style={{ width: "200px" }}
      placeholder="Select locale"
      options={localeData.filter((item)=> item.value === "all" || item.majorID === localeType)}
      size={undefined}
    />
  );
};

export default Locale;
