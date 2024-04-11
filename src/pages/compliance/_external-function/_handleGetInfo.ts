import axios from "../../../../server/api/axios";

export const handleGetMunicipalities = async()=>{
    try {
        const response = await axios.get("/data/municipalities")
        if(response.status === 200){
            const data = response.data;
            return [...data]
        }else if(response.status === 404){
            return {message: "No municipalities found.", status: "error"}
        }
    } catch (error) {
        return {message: "An error occured.", status: `${error}`}
    }
}