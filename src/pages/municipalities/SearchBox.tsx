import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "../../../server/api/axios";
import Layout from "../../components/Layout";
import Input from "../../components/Input";
import { Typography,message } from "antd";
import Lottie from "lottie-react";

import typingAni from "../../assets/animations/typing-001.json";

import { NavigateOptions, URLSearchParamsInit,useNavigate } from "react-router-dom";

import { LocaleListProps } from "../../interface/compliance";

interface SearchProps {
  currentQuery: string | null;
  handleSearchItem: (value: string) => void;
  setSearchParams: (
    nextInit?:
      | URLSearchParamsInit
      | ((prev: URLSearchParams) => URLSearchParamsInit)
      | undefined,
    navigateOpts?: NavigateOptions | undefined
  ) => void;
  setOnSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBox = ({ currentQuery, setSearchParams,setOnSearch}: SearchProps) => {
  const [results, setResults] = useState<LocaleListProps[] | []>();
  const [searchTerm, setSearchTerm] = useState(currentQuery || "");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [messageApi,contextMessage] = message.useMessage()

  const navigate = useNavigate()

  const handleSearchItem = async (query: string) => {
    if (query === "" || !query) return;
    setIsSearching(true);

    try {
      const response = await axios.get(`/data/search-locale`, {
        params: { searchTerm: query },
      });
      if (response.status === 200) {
        const data: LocaleListProps[] = response.data;
        setResults(data);
        setIsSearching(false);
        console.log(response.data);
        console.log("Success!");
      }
      // handle the response as needed
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useDebouncedCallback((value) => {
    handleSearchItem(value);
    setSearchParams(
      (prev) => {
        prev.set("query", value);
        return prev;
      },
      { replace: true }
    );
    setIsTyping(false);
  }, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setIsTyping(true);
    debouncedSearch(value);
  };

  const handleViewLocale = (value: string)=>{
    try {
      setOnSearch(false)
      navigate(`/municipalities/locale/${value}`)
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`)
    }
  }

  useEffect(()=>{
    if(currentQuery === "" || !currentQuery){
      setResults([])
    }
  },[currentQuery])


  return (
    <Layout style={{ width: "100%", height: "auto", maxHeight: "400px",backgroundColor: "#fff" }}>
      {contextMessage}
      <div>
        <Input
          disabled={isSearching}
          size={"small"}
          placeholder={"Type locale name"}
          variant={undefined}
          value={searchTerm}
          onChange={handleChange}
        />
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center",backgroundColor: "#fff" }}
        >
          {isTyping && (
            <div style={{ width: 50 }}>
              <Lottie animationData={typingAni} loop={true} />{" "}
            </div>
          )}
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center", backgroundColor: "#fff" }}
        >
          {isSearching && <Typography>Searching</Typography>}
        </div>

        {results && currentQuery !== "" && (
          <div
         
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              marginTop: "16px",
              overflowY: "auto",
              backgroundColor: "#fff"
            }}
          >
            {Object.values(results).length === 0 && currentQuery !== "" ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography style={{ fontWeight: 500 }}>
                  No item found
                </Typography>
              </div>
            ) : (
              Object.values(results)
                .sort((a, b) => {
                  if (a.municipalityName < b.municipalityName) {
                    return -1;
                  }
                  if (a.municipalityName > b.municipalityName) {
                    return 1;
                  }
                  return 0;
                })
                .map((item) => (
                  <div
                  onClick={()=> handleViewLocale(item.zipCode)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    <Typography style={{ fontWeight: 600 }}>
                      {item.municipalityName}
                    </Typography>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchBox;
