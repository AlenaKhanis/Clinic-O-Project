import { toZonedTime, format } from 'date-fns-tz';
import { Appointment } from "../Types";

export const useGlobalFunctions = () => {
    const parseDateTime = (data: Appointment[]): Appointment[] => {
        return data.map(appointment => {
            const date = new Date(appointment.date_time);
            const zonedDate = toZonedTime(date, 'Etc/UTC');
            return {
                ...appointment,
                date: format(zonedDate, 'dd.MM.yyyy', { timeZone: 'Etc/UTC' }),
                time: format(zonedDate, 'HH:mm', { timeZone: 'Etc/UTC' })
            };
        });
    }

    return {
        parseDateTime,
    };
};