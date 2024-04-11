import axios from "../../server/api/axios";

const handleGetFieldData = async()=>{
    try {
        const response = await axios.get("/data/audit-fields")
        
    } catch (error) {
        
    }
}