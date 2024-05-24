export const handleFileSize = (bytes: number)=>{
    if (bytes < 1024) {
        return bytes + ' Bytes';
      } else if (bytes >= 1024 && bytes < 1048576) {
        return (bytes / 1024).toFixed(2) + ' KB';
      } else if (bytes >= 1048576 && bytes < 1073741824) {
        return (bytes / 1048576).toFixed(2) + ' MB';
      } else if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(2) + ' GB';
      }
    }