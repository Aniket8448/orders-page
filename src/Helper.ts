import { format, parseISO, isValid } from 'date-fns';

export class AppHelper {
    static formatDate(dateString) {
        if (!dateString) {
            // Handle null, undefined, or empty string
            return 'Invalid date';
        }

        const parsedDate = parseISO(dateString);

        if (!isValid(parsedDate)) {
            // Handle invalid date
            return 'Invalid date';
        }

        // Formatting the date
        try {
            return format(parsedDate, "EEEE, MMMM do").replace('th', ' ');
        } catch (error) {
            // Handle any other errors
            console.error("Error formatting date:", error);
            return 'Invalid date';
        }
    }

    static formatDateAndTime(dateString) {
        if (!dateString) {
            // Handle null, undefined, or empty string
            return 'Invalid date';
        }

        const parsedDate = parseISO(dateString);

        if (!isValid(parsedDate)) {
            // Handle invalid date
            return 'Invalid date';
        }

        // Formatting the date
        try {
            return format(parsedDate, 'dd MMM yyyy, h:mm a').replace('th', ' ');
        } catch (error) {
            // Handle any other errors
            console.error("Error formatting date:", error);
            return 'Invalid date';
        }
    }
}
