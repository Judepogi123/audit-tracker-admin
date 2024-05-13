import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";
import { handleGetLocal, handleSaveLocal } from "../../../utils/localStorage";

import { LocaleListProps, OptionProps } from "../../../interface/compliance";

import Layout from "../../../components/Layout";
import Select from "../../../components/Select";
import { MessageInstance } from "antd/es/message/interface";

interface LocaleProps {
  messageApi: MessageInstance;
  setAllLocale: React.Dispatch<
    React.SetStateAction<LocaleListProps[] | undefined>
  >;
}

const Locale = ({ messageApi, setAllLocale }: LocaleProps) => {
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
            parsedCache.map((item) => ({
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
  }, [localeList?.data, messageApi]);

  return (
    <Select
      placeholder="Select locale"
      options={allLocalList as OptionProps[]}
      size={undefined}
    />
  );
};

export default Locale;
