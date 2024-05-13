export const handleAuditType = async(value: string)=>{
    try {
        if(value.includes("municipal")){
            return "municipal"
        }else if(value.includes("barangay")){
            return "barangay"
        }else{
        return undefined
        }
    } catch (error) {
        return undefined
    }
}