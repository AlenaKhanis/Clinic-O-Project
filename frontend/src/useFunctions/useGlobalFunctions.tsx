import moment from "moment";
import { Appointment } from "../Types";


export const useGlobalFunctions = () => {

    
    const parseDateTime = (data: Appointment[]): Appointment[] => {
        return data.map(appointment => {
          const date = moment.utc(appointment.date_time);
          return {
            ...appointment,
            date: date.format('DD.MM.YYYY'),
            time: date.format('HH:mm')
          };
        });
      }

      return {
        parseDateTime,
      };

};