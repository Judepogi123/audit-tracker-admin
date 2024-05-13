import { format } from "date-fns";

import { toZonedTime } from "date-fns-tz";

const philippinesTimezone = "Asia/Manila";

// Get the current date and time
const currentDate = new Date();

// Convert to Philippines timezone
const currentDateInPhilippines = toZonedTime(currentDate, philippinesTimezone);

// Format the date and time (without timeZone option)
export const formattedDate = format(currentDateInPhilippines, "MMM dd, yyyy hh:mm aa");

export const handleGenerateDate = async()=>{
    try {
        return format(currentDateInPhilippines, "MMM dd, yyyy hh:mm aa");
    } catch (error) {
        return "Date parsing error."
    }
}