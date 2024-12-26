/**
 * Returns the current date in the format "DD/MM/YYYY".
 * @returns {string} The formatted date string.
 */
export function date(): string {
    const dateObj: Date = new Date();
    const formattedDate: string = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    return formattedDate;
}