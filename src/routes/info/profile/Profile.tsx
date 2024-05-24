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
import Loading from "../../../components/Loading";

import ProfileUpload from "../upload/ProfileUpload";

//controller
import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";
import { useParams } from "react-router-dom";
import { handleGetUserInfo } from "../../../provider/UserDataProvider";

//interface
import { UserProps } from "../../../interface/manage";
import { OptionProps } from "../../../interface/compliance";
import { PermissionsProps } from "../../../interface/manage";

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
  const [onReset, setOnReset] = useState<boolean>(false);
  const [onUpload, setOnUpload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [onRemove, setOnRemove] = useState<boolean>(false);
  const [permission, setPermission] = useState<PermissionsProps | undefined>();

  const { userID } = useParams();
  const user = useUserData();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => handleGetUserInfo(userID as string),
  });

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

  const handleReload = async()=>{
    try {
      await refetch()
    } catch (error) {
      messageApi.error(`Something wrong with reloading: ${error}`)
    }
  }

  const handleArchiveSelectedUser = async () => {
    setLoading(true);
    try {
      const request = await axios.post(`/data/archive-user`, {
        username: userData?.userName,
        status: userData?.userIsArchived,
      });
      if (request.status === 200) {
        setOnEdit(false);
        setLoading(false);
        setOnConfirm(false);
        messageApi.success(`Success!`);
        refetch();
        return;
      }
      messageApi.error(`Faild!`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const request = await axios.post(`/data/update-user`, {
        userName: initialData?.userName,
        data: { ...userData, userPermission: JSON.stringify(permission) },
      });
      if (request.status === 200) {
        refetch();
        setOnUpdate(false);
        setLoading(false);
        messageApi.success("Success!");
        return;
      }
      messageApi.error("Failed");
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!userData) {
      messageApi.warning(`Invalid username!`);
      return;
    }
    setLoading(true);
    try {
      const request = await axios.post(`/auth/reset-password`, {
        username: userData?.userName,
        password: `${userData.userName}-dilg`,
      });
      if (request.status === 200 && request.data.status === "ok") {
        console.log(`${userData.userName}-dilg`);
        setOnReset(false);
        setLoading(false);
        messageApi.success(`Success!`);
        return;
      }
      messageApi.error(`${request.data.message}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const request = await axios.delete("/data/delete-user", {
        params: { username: userData?.userName },
      });
      if (request.status === 200) {
        messageApi.success("Success!");
        setLoading(false);
        history.back();
      }
    } catch (error) {
      console.log(error);

      messageApi.error(`Sorry something went wrong`);
    } finally {
      setLoading(false);
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
            alignItems: "center",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Avatar src={userData?.userProfilePicture || "null"} size={160} />
          {userData?.userName === user.userName && (
            <Button onClick={() => setOnUpload(true)}>Upload</Button>
          )}
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
                disabled
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
                  : userData?.userLocaleType === "barangay"
                  ? "Barangay"
                  : "Unknown"}
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

      {userData?.userLocaleType === "provincial" ? (
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
        {user.userName === userData?.userName || user.userPermission === "all" && (
          <Button onClick={() => setOnEdit(!onEdit)}>
            {onEdit ? "Cancel" : "Edit"}
          </Button>
        )}

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
        <Button onClick={() => setOnReset(true)}>Reset password</Button>
        {userData?.userPermission || user.userPermission === "all" ? (
          <Button onClick={()=> setOnRemove(true)}>Remove user</Button>
        ) : null}
      </div>
      {/* Archive user */}
      <Modal
        onFunction={handleArchiveSelectedUser}
        width={400}
        title={`${user.userIsArchived ? "Unarchive" : "Archive"} user: ${
          userData?.userFullName
        }?`}
        children={undefined}
        openModal={onConfirm}
        setCloseModal={() => setOnConfirm(false)}
      />

      {/* Update profile */}
      <Modal
        onFunction={handleUpdateProfile}
        width={400}
        title={`Update user: ${userData?.userFullName}`}
        children={"Save update?"}
        openModal={onUpdate}
        setCloseModal={() => setOnUpdate(false)}
      />

      {/* Resest Password */}
      <Modal
        onFunction={handleResetPassword}
        width={400}
        title={`Reset password of user: ${userData?.userFullName}`}
        children={"The reset password is the `<username>-dilg`"}
        openModal={onReset}
        setCloseModal={() => setOnReset(false)}
      />

      {/* Update Profile */}
      <Modal
        okHid={true}
        width={600}
        title={`Update profile picture`}
        children={
          <ProfileUpload
          handleReload={handleReload}
            setLoading={setLoading}
            messageApi={messageApi}
            setOnUpload={setOnUpload}
          />
        }
        openModal={onUpload}
        setCloseModal={() => setOnUpload(false)}
      />

      {/* loading */}
      <Modal
        cancelHid={true}
        okHid={true}
        width={400}
        children={<Loading type={"classic"} />}
        openModal={loading}
        setCloseModal={() => {
          if (loading) {
            return;
          }
          setLoading(false);
        }}
      />

    {/* !!!Remove user */}
      <Modal
      onFunction={handleDeleteUser}
        width={400}
        title={`Remove user: ${userData?.userFullName}`}
        children={`By confirming this action, the user will be remove permanently and cannot be undo afterwards.`}
        openModal={onRemove}
        setCloseModal={() => setOnRemove(false)}
      />
    </Layout>
  );
};

export default Profile;
