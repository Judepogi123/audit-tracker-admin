export const handleFileSize = (value: number): string=>{
    if(value < 1001){
        return `${value} KB`
    }else{
        return `${value} MB`
    }
}