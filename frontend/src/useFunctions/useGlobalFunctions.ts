import { toZonedTime, format } from 'date-fns-tz';
import { Appointment, Doctor, Owner, Patient } from "../Types";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

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

    const handleSaveChanges = async (
        editedProfile: Doctor | Patient | Owner,
        setAlert: (message: string, variant: 'success' | 'danger') => void,
        originalProfile: Doctor | Patient | Owner
      ) => {
        if (!editedProfile || !originalProfile) {
          setAlert('Invalid profile data', 'danger');
          return;
        }
      
        try {
          // Build an object with only the changed fields
          const editedFields: Partial<Doctor & Patient & Owner> = {};
          (Object.keys(editedProfile) as (keyof typeof editedProfile)[]).forEach(key => {
            if (editedProfile[key] !== originalProfile[key]) {
              // Use type assertions to ensure the correct type for each property
              editedFields[key] = editedProfile[key] as Doctor[keyof Doctor] & Patient[keyof Patient] & Owner[keyof Owner];
            }
          });
      
          // Determine the profile type and set the appropriate URL
          let url = '';
          if (isDoctorProfile(editedProfile)) {
            url = `${BACKEND_URL}/edit_doctor_profile/${editedProfile.doctor_id}`;
          } else if (isPatientProfile(editedProfile)) {
            url = `${BACKEND_URL}/edit_patient_profile/${editedProfile.patient_id}`;
          } else if (isOwnerProfile(editedProfile)) {
            url = `${BACKEND_URL}/edit_owner_profile/${editedProfile.owner_id}`;
          } else {
            throw new Error('Invalid profile type');
          }
      
          // Send only the edited fields to the server
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedFields),
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          setAlert('Profile updated successfully', 'success');
          return data;
        } catch (error) {
          console.error('Error updating profile:', error);
          setAlert('Error updating profile', 'danger');
          throw error;
        }
      };
      
    
      function isDoctorProfile(profile: Doctor | Patient | Owner): profile is Doctor {
        return 'doctor_id' in profile;
      }
    
      function isPatientProfile(profile: Doctor | Patient | Owner): profile is Patient {
        return 'patient_id' in profile;
      }
    
      function isOwnerProfile(profile: Doctor | Patient | Owner): profile is Owner {
        return 'owner_id' in profile;
      }

    return {
        parseDateTime,
        handleSaveChanges
    };
};