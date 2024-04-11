import { Dispatch, SetStateAction } from "react";
import axios from "../../../../../server/api/axios";

export const handleArchiveField = async (
  id: string,
  setArchiveFieldStatus: Dispatch<
    SetStateAction<{ message: string; status: string } | null>
  >,
  date: string
) => {
  try {
    const response = await axios.post("/data/archiveField", {
      id: id,
      date: date,
    });
    if (response.status === 200) {
      setArchiveFieldStatus({
        message: response.data.message,
        status: response.data.status,
      });
    } else if (response.status === 404) {
      setArchiveFieldStatus({
        message: response.data.message,
        status: response.data.status,
      });
    } else {
      setArchiveFieldStatus({
        message: response.data.message,
        status: response.data.status,
      });
    }
  } catch (error) {
    setArchiveFieldStatus({
      message: `Sorry, something went wrong; ${error}`,
      status: "error",
    });
  }
};
