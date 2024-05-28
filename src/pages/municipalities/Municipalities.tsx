import { useEffect, useState } from "react";

// UI components
import Layout from "../../components/Layout";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import { Typography, message } from "antd";
import Loading from "../../components/Loading";

// Controller and data fetching
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBox from "./SearchBox";
import { useUserData } from "../../provider/DataProvider";
import { useDebounce } from "use-debounce";

// Interfaces
import { LocaleProps } from "../../interface/locale";
import { PermissionsProps } from "../../interface/manage";
import axios from "../../../server/api/axios";

const menuList = [
  { label: "All", value: "all" },
  { label: "Municipal", value: "municipal" },
  { label: "Barangay", value: "barangay" },
];

const queryKey = ["municipalityName", "zipCode"];

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

  const [searchQuery] = useDebounce(currentQuery, 500);

  const {
    data: localeDatas,
    isError,
    error,
    isLoading
  } = useQuery({
    queryKey: ["localeData"],
    queryFn: () => axios.get(`/data/locale`),
  });

  useEffect(() => {
    const handleUserPermission = () => {
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

    handleUserPermission();
  }, [user]);

  const handleNavigate = () => {
    if (
      permission &&
      typeof permission === "object" &&
      "municipals" in permission
    ) {
      if (
        permission.municipals === "municipalR" ||
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
    if (localeDatas?.data) {
      const localeDataList: LocaleProps[] = localeDatas?.data;

      setLocaleList(localeDataList);
    } else {
      setLocaleList([]);
    }
  }, [localeDatas?.data]);

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

  const handleViewLocale = (value: string) => {
    try {
      setOnSearch(false);
      navigate(`/municipalities/locale/${value}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  const handleFilter = () => {
    if (!localeList || localeList.length === 0) {
      return [];
    }
    return Object.values(localeList || [])
      .sort((a, b) => {
        if (a.municipalityName < b.municipalityName) {
          return -1;
        }
        if (a.municipalityName > b.municipalityName) {
          return 1;
        }
        return 0;
      })
      .filter(
        (item) =>
          (currentType === "all" || item.type === currentType) &&
          queryKey.some((key) =>
            (item as any)[key]
              ?.toLowerCase()
              ?.includes(searchQuery?.toLowerCase())
          )
      );
  };

  if (isError) {
    return (
      <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
        <div style={{ margin: "auto" }}>
          <Typography style={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Sorry something went wrong
          </Typography>
          <Typography>{error.message}</Typography>
          <Typography>Please try to refresh the page</Typography>
        </div>
      </Layout>
    );
  }

  if(isLoading){
    return (
      <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
        <div style={{ margin: "auto" }}>
         <Spinner size="large"/>
        </div>
      </Layout>
    );
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
          <Input
            onChange={(e) =>
              setSearchParams(
                (prev) => {
                  prev.set("query", e.target.value);
                  return prev;
                },
                { replace: true }
              )
            }
            value={currentQuery as string}
            size={"small"}
            placeholder={"Search"}
            variant={undefined}
          />
          <Select
            onChange={handleChangeType}
            value={currentType}
            defaultValue="all"
            style={{ width: "150px" }}
            options={menuList}
            size={undefined}
          />
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
          padding: "4px 8px"
        }}
      >
        {handleFilter().length < 1 ? (
          <div style={{ width: "100%", height: "100%", display: "grid" }}>
            <Typography style={{ fontWeight: 600, fontSize: "1.2rem", margin: "auto" }}>
              No item found!
            </Typography>
          </div>
        ) : (
          handleFilter().map((item) => (
            <div
              key={item.zipCode}
              onClick={() => handleViewLocale(item.zipCode)}
              style={{
                width: "100%",
                height: "auto",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
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
