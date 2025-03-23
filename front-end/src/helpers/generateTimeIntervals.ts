export const generateTimeIntervals = (): string[] => {
    const intervals: string[] = [];
    const now = new Date();
  
    // Convert current time to EST
    const estNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
  
    // Round the current time to the nearest 15-minute interval
    const minutes = estNow.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
  
    if (roundedMinutes === 60) {
      // If rounding results in 60 minutes, move to the next hour
      estNow.setHours(estNow.getHours() + 1, 0, 0, 0);
    } else {
      estNow.setMinutes(roundedMinutes, 0, 0); // Set to the rounded interval, reset seconds and milliseconds
    }
  
    for (let i = 0; i < 4; i++) {
      const start = new Date(estNow.getTime() + i * 15 * 60 * 1000);
      const end = new Date(start.getTime() + 15 * 60 * 1000);
  
      const formattedInterval = `${start
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(" AM", "")
        .replace(" PM", "")} - ${end
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(" AM", "")
        .replace(" PM", "")}`;
  
      intervals.push(formattedInterval);
    }
  
    return intervals;
};