export const handleDefineType = (value: string)=>{
    try {
        if(value.includes("-municipal"))return "municipal"
        return "barangay"
    } catch (error) {
        console.log();
        return "Invalid data"
    }
}