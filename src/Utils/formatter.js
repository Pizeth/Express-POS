// Date formatting utility functions

//Date formatter

export const dateFormatter = {
  // Format date with timezone
  formatDateWithTimezone(date, timezone, locale = "en-US") {
    return new Date(date).toLocaleString(locale, {
      timeZone: timezone,
      dateStyle: "full",
      timeStyle: "long",
    });
  },

  // Format time only with timezone
  formatTimeWithTimezone(date, timezone, locale = "en-US") {
    return new Date(date).toLocaleString(locale, {
      timeZone: timezone,
      timeStyle: "long",
    });
  },

  // Get current date in specific timezone
  getCurrentDateInTimezone(timezone, locale = "en-US") {
    return new Date().toLocaleString(locale, {
      timeZone: timezone,
    });
  },
};

// Usage examples:
// const date = new Date();

// // Different timezone examples
// console.log(dateFormatter.formatDateWithTimezone(date, "America/New_York"));
// // Example output: "Tuesday, November 19, 2024 at 2:30:45 PM EST"

// console.log(
//   dateFormatter.formatDateWithTimezone(date, "Asia/Phnom_Penh", "km-KH")
// );
// // Example output: "2024年11月20日水曜日 4時30分45秒 JST"

// console.log(
//   dateFormatter.formatDateWithTimezone(date, "Europe/London", "en-GB")
// );
// // Example output: "Tuesday, 19 November 2024 at 19:30:45 GMT"

// // Time only in different timezones
// console.log(dateFormatter.formatTimeWithTimezone(date, "America/Los_Angeles"));
// // Example output: "11:30:45 AM PST"

// // Current date in specific timezone
// console.log(dateFormatter.getCurrentDateInTimezone("Australia/Sydney"));
// // Example output: "11/20/2024, 6:30:45 AM"

//Time formatter
export const timeFormatter = {
  // 24-hour format (14:30:45)
  get24Hour(timezone = "UTC") {
    return new Date().toLocaleString("en-US", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  // 12-hour format (02:30:45 PM)
  get12Hour(timezone = "UTC") {
    return new Date().toLocaleString("en-US", {
      timeZone: timezone,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  // Short time (14:30)
  getShortTime(timezone = "UTC") {
    return new Date().toLocaleString("en-US", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Full format with timezone (14:30:45 EDT)
  getFullTimeWithZone(timezone = "UTC") {
    return new Date().toLocaleString("en-US", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  },

  // Custom format with specific options
  getCustomFormat(options = {}, timezone = "UTC", locale = "en-US") {
    return new Date().toLocaleString(locale, {
      timeZone: timezone,
      ...options,
    });
  },

  // ISO string format
  getISOString() {
    return new Date().toISOString();
  },

  // Unix timestamp (milliseconds)
  getUnixTimestamp() {
    return Date.now();
  },

  // Unix timestamp (seconds)
  getUnixTimestampSeconds() {
    return Math.floor(Date.now() / 1000);
  },
};

// Usage examples:
// console.log(timeFormatter.get24Hour("America/New_York"));
// // Output: "14:30:45"

// console.log(timeFormatter.get12Hour("America/New_York"));
// // Output: "02:30:45 PM"

// console.log(timeFormatter.getShortTime("America/New_York"));
// // Output: "14:30"

// console.log(timeFormatter.getFullTimeWithZone("America/New_York"));
// // Output: "14:30:45 EDT"

// console.log(
//   timeFormatter.getCustomFormat(
//     {
//       weekday: "long",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     },
//     "America/New_York"
//   )
// );
// // Output: "Tuesday, 02:30:45 PM"

// console.log(timeFormatter.getISOString());
// // Output: "2024-11-19T19:30:45.123Z"

// console.log(timeFormatter.getUnixTimestamp());
// // Output: 1700421045123

// console.log(timeFormatter.getUnixTimestampSeconds());
// // Output: 1700421045

export default { dateFormatter, timeFormatter };
