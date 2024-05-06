import { useState } from "react";
import '../css/AppointmentSummeryForm.css';

function Appointment() {
  const [summary, setSummary] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Do something with the form data, such as sending it to the server
    console.log("Form submitted:", { summary, diagnosis, prescription });
    // Clear the form fields after submission
    setSummary("");
    setDiagnosis("");
    setPrescription("");
  };

  return (
    <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="summary">Summary:</label>
        <input
          type="text"
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="diagnosis">Diagnosis:</label>
        <input
          type="text"
          id="diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="prescription">Prescription:</label>
        <input
          type="text"
          id="prescription"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send</button>
    </form>
    </div>
  );
}

export default Appointment;
