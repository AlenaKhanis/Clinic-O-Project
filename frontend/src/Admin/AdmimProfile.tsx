import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Owner } from "../Types";
import { useBackendUrl } from "../BackendUrlContext";

function AdminProfile() {
    const [admin, setAdmin] = useState<Owner | null>(null);
    const BACKEND_URL = useBackendUrl();

    useEffect(() => {
        fetch(`${BACKEND_URL}/admin`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch admin profile");
                }
                return response.json();
            })
            .then(data => {
                setAdmin(data);
            })
            .catch(error => {
                console.error("Error fetching admin profile:", error);
                setAdmin(null); // Reset admin state on error to handle retry or error message
            });
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
                    {admin === null ? (
                        <tr>
                            <td colSpan={4}>Loading...</td>
                        </tr>
                    ) : (
                        <tr>
                            <td>{admin.full_name}</td>
                            <td>{admin.email}</td>
                            <td>{admin.phone}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminProfile;
