//helper function to format dates
export const formatSelectedDate = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const dateObject = date instanceof Date ? date : new Date(date);

  const formattedDate = dateObject.toLocaleDateString(undefined, options);
  return formattedDate;
};
