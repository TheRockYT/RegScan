function doDate(date) {
  let asDate = new Date(date);
  let diff = new Date() - asDate;
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let formattedDate = asDate.toLocaleDateString("en-US");

  return { date: asDate, diff: diff, days: days, formattedDate: formattedDate };
}
