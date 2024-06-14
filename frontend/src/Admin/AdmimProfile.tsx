import { useEffect, useState } from "react";
import { ListGroup, Button } from "react-bootstrap";
import { Owner } from "../Types";
import { useBackendUrl } from "../BackendUrlContext";
import EditProfile from "../useFunctions/EditProfileProps";
import "../css/AdminProfile.css";

function AdminProfile({ subId }: { subId: string | null }) {
  const [admin, setAdmin] = useState<Owner | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const BACKEND_URL = useBackendUrl();

  useEffect(() => {
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
  }, [ subId , showEditModal]);

  return (
    <div className="admin-profile-container">
      <h1 className="admin-profile-header">Admin Profile</h1>
      {admin === null ? (
        <p>Loading...</p>
      ) : (
        <ListGroup className="admin-profile-list">
          <ListGroup.Item>ID: {admin.owner_id}</ListGroup.Item>
          <ListGroup.Item>Name: {admin.full_name}</ListGroup.Item>
          <ListGroup.Item>Email: {admin.email}</ListGroup.Item>
          <ListGroup.Item>Role: {admin.role}</ListGroup.Item>
          <ListGroup.Item>Phone: {admin.phone}</ListGroup.Item>
          <ListGroup.Item className="admin-profile-actions">
            <Button variant="primary" onClick={() => setShowEditModal(true)}>
              Edit
            </Button>
          </ListGroup.Item>
        </ListGroup>
      )}
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
