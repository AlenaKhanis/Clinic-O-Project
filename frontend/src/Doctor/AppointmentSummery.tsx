// import { useEffect, useState } from "react";
// import '../css/AppointmentSummeryForm.css';
// import { Button } from "react-bootstrap";
// import { useAppointments } from "./doctorAppointmentFunction";

// function Appointment({ patientId }: { patientId: number | null }) {
//   const [summary, setSummary] = useState("");
//   const [diagnosis, setDiagnosis] = useState("");
//   const [prescription, setPrescription] = useState("");

//   const { selectedPatientDetails} = useAppointments();


  

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Form submitted:", { summary, diagnosis, prescription });
//     setSummary("");
//     setDiagnosis("");
//     setPrescription("");
//   };

//   return (
//     <>
//       <div>
//         {selectedPatientDetails && (
//           <div className="table-container">
//             <h3>Appointment Details</h3>
//             <p>Patient Name: {selectedPatientDetails.full_name}</p>
//             <p>Patient Package: {selectedPatientDetails.package}</p>
//             <p>Age: {selectedPatientDetails.age}</p>
//             {selectedPatientDetails.diagnosis ? (
//               <p>Diagnoses: {selectedPatientDetails.diagnosis}</p>
//             ) : (<p>Diagnoses: No Diagnosis Available</p>)}
//             {selectedPatientDetails.prescription ? (
//               <p>Prescription: {selectedPatientDetails.prescription}</p>
//             ) : (<p>Prescription: No Prescription Available</p>)}
//           </div>
//         )}

//       </div>

//       <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
//         <div className="containerSummery">
//           <form onSubmit={handleSubmit}>
//             <div className="row">
//               <div className="col-25">
//                 <label htmlFor="summary">Diagnosis</label>
//               </div>
//               <div className="col-75">
//                 <input type="text" id="summary" name="summary" placeholder="Diagnosis.." />
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-25">
//                 <label htmlFor="lname">Prescription</label>
//               </div>
//               <div className="col-75">
//                 <input type="text" id="lname" name="lastname" placeholder="Prescription.." />
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-25">
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-25">
//                 <label htmlFor="subject">Summary</label>
//               </div>
//               <div className="col-75">
//                 <textarea id="subject" name="subject" placeholder="Write summary.." style={{ height: '200px' }}></textarea>
//               </div>
//             </div>
//             <div className="row">
//               <Button className="sendButton" variant="outline-dark" type="submit">Send</Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Appointment;
