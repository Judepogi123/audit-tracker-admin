import axios from "../../server/api/axios";

export const handleFetchArea = async()=>{
    try {
        const response = await axios.get(`/data/compliance`)
        if(response.status === 200 && response.data){
            return {data :response.data, status: "ok"}
        }
        return {data: "Not found", status: "empty"}
    } catch (error) {
        return {data: `Error: ${error}`, status: "failed"}
    }
}