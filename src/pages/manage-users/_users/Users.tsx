import { useEffect, useState, useRef } from "react";
import Layout from "../../../components/Layout";
import Avatar from "../../../components/Avatar";
import { Typography, message } from "antd";
import Spinner from "../../../components/Spinner";
import "./style.scss";

//api
import { handleFetchUser } from "../../../api/users";
import UserFieldHeader from "./_header/UserFieldHeader";

//interface
import { UserProps } from "../../../interface/manage";

//controller
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
//context
import { useUserData } from "../../../provider/DataProvider";

const Users = () => {
  const [userList, setUserList] = useState<UserProps[]>([]);
  const [messageApi, contextMessage] = message.useMessage()
  const scrollPosition = useRef(0);

  const user: UserProps = useUserData();
  const navigate = useNavigate()
  const { ref: inViewRef, inView } = useInView();

  const {
    fetchNextPage,
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["userData"],
    queryFn: ({ pageParam = "initial" }) => handleFetchUser(pageParam),
    initialPageParam: "initial",
    getNextPageParam: (lastPage) => {
      if (lastPage && Object.values(lastPage).length === 0) return 1;
      return lastPage.lastVisible;
    },
  });
  

  useEffect(() => {
    if (data?.pages) {
      const flattenedData: UserProps[] = data.pages.flatMap(
        (entry) => entry.data
      );
      setUserList(flattenedData);
      return;
    }
    setUserList([]);
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      scrollPosition.current = document.documentElement.scrollTop || document.body.scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, scrollPosition.current);
  }, []);

  const handleViewUser = (id: string) => {
    try {
      navigate(`/manage/user/${id}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}
      <div style={{ width: "100%", height: "10%", border: "1px solid #ccc" }}>
        <UserFieldHeader />
      </div>

      <div
        style={{
          width: "100%",
          height: "90%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          gap: "8px",
          padding: "8px 0px 4px",
        }}
      >
        {isLoading ? (
          <div style={{ width: "100%", height: "100%", display: "grid" }}>
            {" "}
            <div style={{ margin: "auto" }}>
              <Spinner size="large" />
            </div>{" "}
          </div>
        ) : userList.length === 0 ? (
          <div style={{ width: "100%", height: "100%", display: "grid" }}>
            {" "}
            <div style={{ margin: "auto" }}>
              <Typography
                style={{ fontWeight: 500, fontSize: "1.2rem", margin: "auto" }}
              >
                Empty
              </Typography>
            </div>{" "}
          </div>
        ) : (
          userList
            .sort((a, b) => {
              if (a.userFullName < b.userFullName) {
                return -1;
              }
              if (a.userFullName > b.userFullName) {
                return 1;
              }
              return 0;
            })
            .map((item, index) => (
              <div
                onClick={() => handleViewUser(item.userName)}
                className="item"
                key={item.userName}
                style={{
                  width: "100%",
                  height: "200px",
                  padding: "12px",
                  border: "1px solid #ccc",
                  display: "flex",
                  borderRadius: "8px",
                  gap: "16px",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ marginLeft: "12px" }}>
                  <Avatar size={50} src={item.userProfilePicture} />
                </div>
                <div>
                  <Typography style={{ fontSize: "1.1rem", fontWeight: 500 }}>
                    {item.userFullName || item.userName}{" "}
                    {user.userName === item.userName ? "(You)" : ""}
                  </Typography>
                  <Typography>
                    {item.userLocaleType === "municipal"
                      ? "Municipal"
                      : item.userLocaleType === "provincial"
                      ? "Provicial"
                      : "Barangay"}
                  </Typography>
                  <Typography>
                    {item.userType === "client" ? "Client" : "Admin"}
                  </Typography>
                </div>
              </div>
            ))
        )}
        <div ref={inViewRef}></div>
        {isFetchingNextPage && (
          <div
            style={{
              width: "100%",
              padding: "8px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <Spinner />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
