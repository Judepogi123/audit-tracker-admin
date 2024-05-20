import { useEffect, useState } from "react";

//ui
import Layout from "../../../components/Layout";
import { Typography, message, Divider } from "antd";
import Button from "../../../components/Button";
import Avatar from "../../../components/Avatar";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import { Radio as Radios } from "antd";
import Spinner from "../../../components/Spinner";
import Modal from "../../../components/Modal";

//controller
import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";
import { useParams } from "react-router-dom";
import { handleGetUserInfo } from "../../../provider/UserDataProvider";

//interface
import { UserProps } from "../../../interface/manage";
import { OptionProps } from "../../../interface/compliance";
import { PermissionsProps } from "../../../interface/manage";

//utils
import { handleSaveLocal, handleGetLocal } from "../../../utils/localStorage";

//context
import { useUserData } from "../../../provider/DataProvider";
import Radio from "../../../components/Radio";

const localeTypeList: OptionProps[] = [
  { label: "Provincial", value: "provincial" },
  { label: "Municipal", value: "municipal" },
  { label: "Barangay", value: "barangay" },
];

const Profile = () => {
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProps | undefined>(undefined);
  const [messageApi, contextMessage] = message.useMessage();
  const [initialData, setInitialData] = useState<UserProps | undefined>(
    undefined
  );
  const [edited, setEdited] = useState<boolean>(false);
  const [onConfirm, setOnConfirm] = useState<boolean>(false);
  const [onUpdate, setOnUpdate] = useState<boolean>(false);
  const [isArchiving, setIsArchiving] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [permission, setPermission] = useState<PermissionsProps | undefined>();

  const { userID } = useParams();
  const user = useUserData();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => handleGetUserInfo(userID as string),
  });

  console.log(permission?.archived);

  useEffect(() => {
    const handleUserInfo = () => {
      try {
        if (data) {
          const temp: UserProps = data;

          const permission: PermissionsProps =
            temp.userPermission !== "all"
              ? JSON.parse(`${temp.userPermission}`)
              : {};
          setPermission(permission);
          setUserData({ ...temp, userPermission: permission });
        }
      } catch (error) {
        messageApi.error(`Sorry something went wrong: ${error}`);
      }
    };
    handleUserInfo();
  }, [data]);

  useEffect(() => {
    if (data) {
      setUserData(data);
      setInitialData(data);
    }
  }, [data]);

  const handleChangeInfo = (type: string, value: string) => {
    setUserData((prev) => {
      if (!prev) return;
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  const hanldeChangePermission = (type: string, data: string) => {
    if (!onEdit) return;
    setPermission((prev) => {
      if (!prev) return;
      return {
        ...prev,
        [type]: data,
      };
    });
  };

  useEffect(() => {
    if (JSON.stringify(userData) === JSON.stringify(initialData)) {
      setEdited(false);
      return;
    }
    setEdited(true);
  }, [userData, initialData]);

  useEffect(() => {
    if (JSON.stringify(permission) === initialData?.userPermission) {
      setEdited(false);
      return;
    }
    setEdited(true);
  }, [permission, initialData]);

  const handleArchiveSelectedUser = async () => {
    setIsArchiving(true);
    try {
      const request = await axios.post(`/data/archive-user`, {
        username: userData?.userName,
        status: userData?.userIsArchived,
      });
      if (request.status === 200) {
        setOnEdit(false)
        setIsArchiving(false);
        setOnConfirm(false);
        messageApi.success(`Success!`);
        refetch();
        return;
      }
      messageApi.error(`Faild!`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const request = await axios.post(`/data/update-user`, {
        userName: initialData?.userName,
        data: { ...userData, userPermission: JSON.stringify(permission) },
      });
      if (request.status === 200) {
        refetch();
        setOnUpdate(false);
        setIsUpdating(false);
        messageApi.success("Success!");
        return;
      }
      messageApi.error("Failed");
    } catch (error) {
      console.log(error);
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
        <div style={{ margin: "auto" }}>
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        overflowY: "auto",
      }}
    >
      {contextMessage}
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          padding: "8px 16px",
        }}
      >
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <Avatar src={userData?.userProfilePicture || "null"} size={160} />
        </div>

        <div
          style={{
            width: "70%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Typography
              style={{ fontWeight: 400, width: "120px", fontSize: "1rem" }}
            >
              Name:
            </Typography>
            {onEdit ? (
              <Input
                onChange={(e) =>
                  handleChangeInfo("userFullName", e.target.value)
                }
                value={userData?.userFullName}
                size={"small"}
                placeholder={""}
                variant={undefined}
              />
            ) : (
              <Typography style={{ fontWeight: 600, fontSize: "1rem" }}>
                {userData?.userFullName || "Unknown"}
              </Typography>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{ fontWeight: 400, width: "120px", fontSize: "1rem" }}
            >
              Username:
            </Typography>
            {onEdit ? (
              <Input
                value={onEdit ? userData?.userName || "Unknown" : ""}
                size={"small"}
                placeholder={""}
                variant={undefined}
              />
            ) : (
              <Typography style={{ fontWeight: 600, fontSize: "1rem" }}>
                {userData?.userName || "Unknown"}
              </Typography>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{ fontWeight: 400, width: "120px", fontSize: "1rem" }}
            >
              Locale:
            </Typography>

            {onEdit ? (
              <Input
                disabled={userData?.userLocaleType === "provincial"}
                value={onEdit ? userData?.userAddress || "Unknown" : ""}
                size={"small"}
                placeholder={""}
                variant={undefined}
              />
            ) : (
              <Typography style={{ fontWeight: 600, fontSize: "1rem" }}>
                {userData?.userAddress || "Unknown"}
              </Typography>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{ fontWeight: 400, width: "120px", fontSize: "1rem" }}
            >
              Locale type:
            </Typography>

            {onEdit ? (
              <Select
                disabled={userData?.userLocaleType === "provincial"}
                onChange={(e) => handleChangeInfo("userLocaleType", e)}
                value={userData?.userLocaleType}
                defaultValue="provincial"
                style={{ width: "100%" }}
                options={localeTypeList}
                size={undefined}
              />
            ) : (
              <Typography style={{ fontWeight: 600, fontSize: "1rem" }}>
                {userData?.userLocaleType === "provincial"
                  ? "Provincial"
                  : userData?.userLocaleType === "municipal"
                  ? "Field"
                  : "Barangay" || "Unknown"}
              </Typography>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              style={{ fontWeight: 400, width: "120px", fontSize: "1rem" }}
            >
              Locale code:
            </Typography>

            {onEdit ? (
              <Input
                disabled={userData?.userLocaleType === "provincial"}
                value={userData?.userZoneId || "Unknown"}
                size={"small"}
                placeholder={""}
                variant={undefined}
              />
            ) : (
              <Typography style={{ fontWeight: 600, fontSize: "1rem" }}>
                {userData?.userZoneId || "Unknown"}
              </Typography>
            )}
          </div>
        </div>
      </div>

      <Divider />

      {typeof permission === "object" &&
      userData?.userLocaleType === "provincial" ? (
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "100%", padding: "0px 8px 16px" }}>
            <Typography
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginLeft: "150px",
              }}
            >
              Permissions
            </Typography>
          </div>
          <div style={{ width: "60%" }}>
            <div>
              <Typography>Audit</Typography>
              <Radios.Group
                onChange={(e) =>
                  hanldeChangePermission("audit", e.target.value)
                }
                value={permission?.audit || "auditR"}
              >
                <Radio value="auditR">Read only</Radio>
                <Radio value="auditRnW">Read and Write</Radio>
              </Radios.Group>
            </div>

            <div>
              <Typography>Compliance</Typography>
              <Radios.Group
                onChange={(e) =>
                  hanldeChangePermission("compliance", e.target.value)
                }
                value={permission?.compliance || "complianceR"}
              >
                <Radio value="complianceR">Read only</Radio>
                <Radio value="complianceRnW">Read and Write</Radio>
              </Radios.Group>
            </div>

            <div>
              <Typography>Area</Typography>
              <Radios.Group
                onChange={(e) =>
                  hanldeChangePermission("fields", e.target.value)
                }
                value={permission?.fields || "fieldsR"}
              >
                <Radio value="fieldsR">Read only</Radio>
                <Radio value="fieldsRnW">Read and Write</Radio>
              </Radios.Group>
            </div>

            <div>
              <Typography>Locale</Typography>
              <Radios.Group
                onChange={(e) =>
                  hanldeChangePermission("municipals", e.target.value)
                }
                value={permission?.municipals || "localeR"}
              >
                <Radio value="localeR">Read only</Radio>
                <Radio value="localeRnW">Read and Write</Radio>
              </Radios.Group>
            </div>

            <div>
              <Typography>User</Typography>
              <Radios.Group
                onChange={(e) =>
                  hanldeChangePermission("users", e.target.value)
                }
                value={permission?.users || "usersR"}
              >
                <Radio value="usersR">Read only</Radio>
                <Radio value="usersRnW">Read and Write</Radio>
              </Radios.Group>
            </div>

            <div>
              <Typography>Files</Typography>
              <Radios.Group
                onChange={(e) =>
                  hanldeChangePermission("files", e.target.value)
                }
                value={permission?.files || "filesR"}
              >
                <Radio value="filesR">Read only</Radio>
                <Radio value="filesRnW">Read and Write</Radio>
              </Radios.Group>
            </div>

            <div>
              <Typography>Archives</Typography>
              <Radios.Group
                onChange={(e) =>
                  hanldeChangePermission("archived", e.target.value)
                }
                value={permission?.archived || "archivedR"}
              >
                <Radio value="archivedR">Read only</Radio>
                <Radio value="archivedRnW">Read and Write</Radio>
              </Radios.Group>
            </div>
          </div>
        </div>
      ) : userData?.userPermission === "all" ? (
        <div>
          {" "}
          <Typography
            style={{
              textAlign: "center",
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            This account is the head/marster Admin
          </Typography>{" "}
        </div>
      ) : null}

      <div
        style={{
          width: "100%",
          display: userData?.userPermission === "all" ? "none" : "flex",
          justifyContent: "flex-end",
          gap: "8px",
          padding: "8px",
        }}
      >
        <Button onClick={() => setOnEdit(!onEdit)}>
          {onEdit ? "Cancel" : "Edit"}
        </Button>
        {onEdit && (
          <Button
            disabled={!edited}
            onClick={() => {
              setOnUpdate(true);
            }}
          >
            Update
          </Button>
        )}
        <Button onClick={() => setOnConfirm(true)}>
          {userData?.userIsArchived === true ? "Unarchive" : "Archive"}
        </Button>
        <Button>Reset password</Button>
      </div>
      <Modal
        loading={isArchiving}
        onFunction={handleArchiveSelectedUser}
        width={400}
        title={`${user.userIsArchived ? "Unarchive" : "Archive"} user: ${
          userData?.userFullName
        }?`}
        children={undefined}
        openModal={onConfirm}
        setCloseModal={() => setOnConfirm(false)}
      />
      <Modal
        loading={isUpdating}
        onFunction={handleUpdateProfile}
        width={400}
        title={`Update user: ${userData?.userFullName}`}
        children={"Save update?"}
        openModal={onUpdate}
        setCloseModal={() => setOnUpdate(false)}
      />
    </Layout>
  );
};

export default Profile;
