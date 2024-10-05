const convertDateTimeToISOString = (dateStr, timeStr) => {
  try {
    const [day, month, year] = dateStr.split("-");

    const [hours, minutes] = timeStr.split(":");

    const date = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date or time format");
    }
    return date;
  } catch (error) {
    console.error("Error converting date and time to ISO:", error.message);
    return null;
  }
};
export { convertDateTimeToISOString };
