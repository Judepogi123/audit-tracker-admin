import { useEffect, useState } from "react";

//ui
import Layout from "../../components/Layout";
import Tabs from "../../components/Tabs";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

import { Typography, message } from "antd";

//controller
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "../../../server/api/axios";
import { useNavigate,useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { handleGetAllLocale } from "../../api/locale";

import SearchBox from "./SearchBox";

import { handleGetLocal, handleSaveLocal } from "../../utils/localStorage";
import { useUserData } from "../../provider/DataProvider";

//interface
import { LocaleProps } from "../../interface/locale";
import { PermissionsProps } from "../../interface/manage";

const menuList = [
  { label: "All", value: "all" },
  { label: "Municipal", value: "municipal" },
  { label: "Barangay", value: "barangay" },
];

interface OptionProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const Municipalities = () => {
  const [messageApi, contextMessage] = message.useMessage();

  const [localeList, setLocaleList] = useState<LocaleProps[] | null>(null);
  const [permission, setPermission] = useState<PermissionsProps | null>(null);
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams({
    type: "all",
    query: "",
  });

  const currentType = searchParams.get("type");
  const currentQuery = searchParams.get("query");
  const navigate = useNavigate();
  const user = useUserData();
  const { ref: itemInView, inView } = useInView();

  const {
    data: localeData,
    isFetchingNextPage,
    error,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["localeData"],
    queryFn: ({ pageParam = "initial" }) => handleGetAllLocale(pageParam),
    initialPageParam: "initial",
    getNextPageParam: (lastPage) => {
      if (lastPage && Object.values(lastPage).length === 0) return 1;
      if(lastPage.nextCursor === "none")return
      return lastPage.nextCursor;
    },
  });

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
  }, [user]);

  const handleNavigate = () => {
    if (
      permission &&
      typeof permission === "object" &&
      "municipals" in permission
    ) {
      if (
        permission.municipals === "minicipalR" ||
        user.userPermission === "all"
      ) {
        messageApi.warning(`Current user is not authorized for this action!`);
        return;
      }
    }
    try {
      navigate("/municipalities/new-locale");
    } catch (error) {
      messageApi.error(`Something went wrong navigating the page: ${error}`);
    }
  };

  useEffect(() => {
    if (localeData?.pages) {
      const flattenedData: LocaleProps[] = localeData.pages.flatMap(
        (entry) => entry.locales
      );
      setLocaleList(flattenedData);
      return;
    }
    setLocaleList([]);
  }, [localeData]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView]);

  const handleChangeType = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("type", value);
        return prev;
      },
      { replace: true }
    );
  };

  const handleCancelSearch = () => {
    setOnSearch(false);
  };

  const handleSearchItem = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("query", value);
        return prev;
      },
      { replace: true }
    );
  };

  const handleViewLocale = (value: string)=>{
    try {
      setOnSearch(false)
      navigate(`/municipalities/locale/${value}`)
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`)
    }
  }
  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      <div style={{ width: "100%", height: "18%" }}>
        <div style={{ width: "100%", padding: "8px" }}>
          <Typography style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
            Locale
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "0px 8px",
            gap: "8px",
          }}
        >
          <div
            onClick={() => setOnSearch(true)}
            style={{
              width: "100%",
              height: "32px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              cursor: "text",
            }}
          >
            <Typography
              style={{
                fontWeight: "initial",
                marginLeft: "8px",
                color: "#adb5bd",
              }}
            >
              {currentQuery === "" ? "Search" : currentQuery}
            </Typography>
          </div>
          <Select
            onChange={handleChangeType}
            value={currentType}
            defaultValue="all"
            style={{ width: "150px" }}
            options={menuList}
            size={undefined}
          />
          {/* <Tabs style={{ overflowX: "auto", width: "100%" }} items={menuList} /> */}
          <Button
            style={{ backgroundColor: "#1982c4", color: "#fff" }}
            onClick={handleNavigate}
          >
            Add
          </Button>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "82%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          gap: "4px",
        }}
      >
        {localeList && localeList.length < 1 ? (
          <div style={{ width: "100%", height: "100%", display: "grid" }}>
            <Typography style={{ fontWeight: 600, fontSize: "1.2rem" }}>
              Empty
            </Typography>
          </div>
        ) : (
          localeList
            ?.sort((a, b) => {
              if (a.municipalityName < b.municipalityName) {
                return -1;
              }
              if (a.municipalityName > b.municipalityName) {
                return 1;
              }
              return 0;
            })
            .filter(
              (item) => currentType === "all" || item.type === currentType
            )
            .map((item) => (
              <div
              onClick={()=> handleViewLocale(item.zipCode)}
                style={{
                  width: "100%",
                  height: "auto",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                <Typography style={{ fontWeight: 600 }}>
                  {item.municipalityName}
                </Typography>
                <Typography style={{ fontSize: ".8rem" }}>
                  {item.zipCode}
                </Typography>
              </div>
            ))
        )}
        <div ref={itemInView} style={{ width: "100%" }}></div>
        {isFetchingNextPage && (
          <div
            style={{
              width: "100%",
              padding: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ margin: "auto" }}>
              <Spinner size="large" />
            </div>
          </div>
        )}
      </div>
      <Modal
        title="Search locale"
        width={800}
        okHid={true}
        children={
          <SearchBox
          setOnSearch={setOnSearch}
          setSearchParams={setSearchParams}
            currentQuery={currentQuery}
            handleSearchItem={handleSearchItem}
          />
        }
        openModal={onSearch}
        setCloseModal={handleCancelSearch}
      />
      {contextMessage}
    </Layout>
  );
};

export default Municipalities;
