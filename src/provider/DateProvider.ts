
function getCurrentDateFormatted(): string {
    const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate: Date = new Date();
    const month: string = months[currentDate.getMonth()];
    const day: number = currentDate.getDate();
    const year: number = currentDate.getFullYear();
    const hours: number = currentDate.getHours();
    const minutes: number = currentDate.getMinutes();
    const seconds: number = currentDate.getSeconds();
    const formattedTime: string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const formattedDate: string = `${month} ${day}, ${year} ${formattedTime}`;
    return formattedDate;
}

// Example usage:
export const formattedDate: string = getCurrentDateFormatted();
