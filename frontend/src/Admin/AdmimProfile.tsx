import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Owner } from "../Types";

function AdminProfile({ BACKEND_URL } : {BACKEND_URL: string}) {
    const [admin, setAdmins] = useState<Owner>();

    useEffect(() => {
        fetch(`${BACKEND_URL}/admin`)
            .then(response => response.json())
            .then(data => {
                setAdmins(data);
            })
            .catch(error => console.error("Error fetching admins:", error));
    }, []);

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
                    <tr>
                        <td>{admin.id}</td>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default AdminProfile;
