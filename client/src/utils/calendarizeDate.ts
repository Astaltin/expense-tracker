export default function calendarizeDate(value: string | number | Date) {
   const date = new Date(value);
   if (isNaN(date.getTime())) {
      throw new Error('Invalid date format. Please provide a valid date string.');
   }

   const year = date.getUTCFullYear();
   const month = String(date.getUTCMonth() + 1).padStart(2, '0');
   const day = String(date.getUTCDate()).padStart(2, '0');

   return `${year}-${month}-${day}`;
}