import React, { useEffect, useState } from "react";


export type UserDataProps = {
  setUserToken: (userId: string | null) => void;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function UserProfile({ setUserToken } : UserDataProps){
  const [userData, setUserData] = useState<any>(null);


  useEffect(() => {
    const storedUserName = localStorage.getItem("user");
    if (storedUserName) {
      const userData = JSON.parse(storedUserName);
      fetch(`${BACKEND_URL}/patient/${userData}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserData(null);
        });
    }
  }, []); 
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserToken(null);
  };
  return(
      <>
        <h2>Current User</h2>
        <p>Username: {userData.username}</p>
        <p>Email: {userData.email}</p>
        <p>Age: {userData.age}</p>
        <p>Role: {userData.role}</p>
        <p>
          <button onClick={handleLogout}>Logout</button>
        </p>
      </>
  );
};

export default UserProfile;
