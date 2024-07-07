import { useEffect, useState } from "react";
import { useBackendUrl } from "../BackendUrlContext"; 

import { Owner } from "../Types";

import EditProfile from "../useFunctions/EditProfileProps";

import { ListGroup, Button } from "react-bootstrap"; 
import "../css/AdminProfile.css"; 

/**
 * AdminProfile Component:
 * This component fetches and displays the profile details of an admin user
 * from the backend based on a provided subId. It allows admins to view their
 * profile information and edit it through an edit modal.
 */
function AdminProfile({ subId }: { subId: string | null }) {
  const [admin, setAdmin] = useState<Owner | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const BACKEND_URL = useBackendUrl(); 

  useEffect(() => {
    // Effect to fetch admin profile data when subId or showEditModal changes
    fetch(`${BACKEND_URL}/admin/${subId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch admin profile");
        }
        return response.json();
      })
      .then((data) => {
        setAdmin(data); 
        console.log(data); 
      })
      .catch((error) => {
        console.error("Error fetching admin profile:", error); 
      });
  }, [subId, showEditModal]); 

  return (
    <div className="admin-profile-container">
      <h1 className="admin-profile-header">Admin Profile</h1>
      {admin === null ? (
        <p>Loading...</p> // Display loading message while admin data is being fetched
      ) : (
        <ListGroup className="admin-profile-list">
          {/* Display admin profile details in a list */}
          <ListGroup.Item>Username: {admin.username}</ListGroup.Item>
          <ListGroup.Item>Name: {admin.full_name}</ListGroup.Item>
          <ListGroup.Item>Email: {admin.email}</ListGroup.Item>
          <ListGroup.Item>Phone: {admin.phone}</ListGroup.Item>
          {/* Button to trigger edit profile modal */}
          <ListGroup.Item className="admin-profile-actions">
            <Button variant="primary" onClick={() => setShowEditModal(true)}>
              Edit
            </Button>
          </ListGroup.Item>
        </ListGroup>
      )}
      {/* Render EditProfile component if admin data is available and showEditModal is true */}
      {admin && (
        <EditProfile
          profile={admin}
          onCancel={() => setShowEditModal(false)}
          isOwner={false}
          showEditModal={showEditModal}
        />
      )}
    </div>
  );
}

export default AdminProfile;
