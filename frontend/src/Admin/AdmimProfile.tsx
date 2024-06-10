import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

function AdminProfile({ BACKEND_URL }) {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/admins`)
            .then(response => response.json())
            .then(data => {
                setAdmins(data);
            })
            .catch(error => console.error("Error fetching admins:", error));
    }, [BACKEND_URL]);

    return (
        <div>
            <h1>Admin Profile</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>{admin.role}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminProfile;
