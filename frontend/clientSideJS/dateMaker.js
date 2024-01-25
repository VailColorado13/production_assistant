export default function dateMaker(currentDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Convert the date to a string in the "Mon-DD-YYYY" format
    const dateString = `${months[currentDate.getMonth()]}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
    
    // Format the time as hhmm
    const timeString = `${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}`;
    
    return `${dateString}`
}

