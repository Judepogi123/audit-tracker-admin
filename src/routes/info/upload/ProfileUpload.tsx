import { useState } from "react";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { Image, Typography } from "antd";

//context
import axios from "../../../../server/api/axios";
import { useUserData } from "../../../provider/DataProvider";
import { MessageInstance } from "antd/es/message/interface";

//ui
import { handleFileSize } from "../../../utils/FileSize";

interface ProfileUploadProps {
  messageApi: MessageInstance;
  setOnUpload: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleReload: () => Promise<void>
}

const ProfileUpload = ({
  messageApi,
  setOnUpload,
  setLoading,
  handleReload
}: ProfileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const user = useUserData();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      messageApi.warning(`No file selected`);
      return;
    }
    setLoading(true);
    const username = user.userName;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("username", username);

    try {
      const response = await axios.post("/data/upload-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        handleReload()
        messageApi.success("Success");
        setOnUpload(false);
        setLoading(false);
        setSelectedFile(null);
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ width: "100%", height: "auto", backgroundColor: "#fff" }}>
      <div>
        <Typography.Paragraph>
          !!!Take note of unnecessary updating/uploading extensive file size.
        </Typography.Paragraph>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setSelectedFile(file);
          }}
          size={"small"}
          placeholder={""}
          variant={undefined}
        />
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            padding: "8px",
          }}
        >
          {selectedFile && (
            <div>
              <Image
                style={{ borderRadius: "50%" }}
                width={200}
                height={200}
                src={URL.createObjectURL(selectedFile) || undefined}
                alt="Selected file preview"
              />
              <Typography style={{ fontWeight: 600, textAlign: "center" }}>
                File size: {handleFileSize(selectedFile.size)}
              </Typography>
            </div>
          )}
        </div>

        <Button
          htmlType="submit"
          style={{
            backgroundColor: "#4096ff",
            color: "#fff",
            width: "100%",
            borderRadius: "30px",
          }}
        >
          Upload
        </Button>
      </form>
    </Layout>
  );
};

export default ProfileUpload;
