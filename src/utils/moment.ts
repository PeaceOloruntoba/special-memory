export function moment(createdAt: any) {
  const now = new Date();
  const past = new Date(createdAt);
  const diffInSeconds = (now.getTime() - past.getTime()) / 1000;
  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = 604800;
  const secondsInMonth = 2592000;
  const secondsInYear = 31536000;

  if (diffInSeconds < secondsInMinute) {
    return `${Math.floor(diffInSeconds)} seconds ago`;
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInWeek) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInMonth) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < secondsInYear) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInSeconds / secondsInYear);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
}
