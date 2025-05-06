
import dayjs from "dayjs";

export const validateDonationTime = (values) => {
    const errors = {};
    const now = dayjs();
    
    // Basic required field validation
    if (!values.donationDate) {
      errors.donationDate = "Date is required";
    }
    
    if (!values.donationTime) {
      errors.donationTime = "Time is required";
    }
  
    // Only proceed with time validation if we have valid inputs
    if (values.donationDate && values.donationTime) {
      const selectedDate = dayjs(values.donationDate);
      
      // Date validation
      if (selectedDate.isBefore(now, 'day')) {
        errors.donationDate = "Date cannot be in the past";
      }
      
      // Time validation for today's date
      if (selectedDate.isSame(now, 'day')) {
        const currentTime = dayjs().format('HH:mm');
        if (values.donationTime <= currentTime) {
          errors.donationTime = "Time must be in the future for today's date";
        }
      }
    }
  
    return errors;
  };