import dayjs from "dayjs";

export const donationTimeValidate = ({ donationDate, donationTime }) => {
  if (!donationDate || !donationTime) return true;
  
  const donationDateTime = dayjs(`${donationDate} ${donationTime}`);
  const now = dayjs();
  
  return donationDateTime.isAfter(now);
};