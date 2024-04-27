// SerchDoctor.tsx
import React, { useState, useEffect } from 'react';

function SearchDoctors({ BACKEND_URL }: { BACKEND_URL: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    // Fetch specialties from the server
    useEffect(() => {
        fetch(`${BACKEND_URL}/get_specialetys`)
            .then(response => response.json())
            .then(data => {
                setSpecialties(data.specialtys);
            })
            .catch(error => console.error('Error fetching specialties:', error));
    }, [BACKEND_URL]);

    const handleSearch = () => {
        fetch(`${BACKEND_URL}/get_doctors_by_specialty/${selectedSpecialty}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Do something with the fetched doctors data
            })
            .catch(error => console.error('Error fetching doctors:', error));
    };
    

    return (
        <>
        <div>
            <h2>Search for Doctors</h2>
            <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                <option value="">Select Specialty</option>
                {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                ))}
            </select>
            <button onClick={handleSearch}>Search</button>
        </div>
        <div>
            dispplay doctors 
        </div>
        </>
    );
}

export default SearchDoctors;
