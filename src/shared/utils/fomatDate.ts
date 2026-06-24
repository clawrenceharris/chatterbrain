/**
 * Reformats momentjs fromNow date
 * @param {string} date
 * @returns the newly formatted date
 */
export function getShortDate(date: Date) {
    const now = new Date();
    const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
    let timeAgo;
  
    if (secondsDiff < 60) {
      timeAgo = `just now`;
    } else if (secondsDiff < 3600) {
      timeAgo = `${Math.floor(secondsDiff / 60)}m ago`;
    } else if (secondsDiff < 86400) {
      timeAgo = `${Math.floor(secondsDiff / 3600)}h ago`;
    } else if (secondsDiff < 604800) {
      timeAgo = `${Math.floor(secondsDiff / 86400)}d ago`;
    } else {
      timeAgo = `${Math.floor(secondsDiff / 604800)}w ago`;
    }
    return timeAgo;
  };