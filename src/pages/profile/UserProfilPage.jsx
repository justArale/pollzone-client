import { useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../context/auth.context";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

function UserProfilPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    const getStudent = () => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        axios
          .get(`${API_URL}/api/${user.role}/${user._id}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          .then((response) => {
            console.log(response);
            setUserProfile(response.data);
            setLoading(false);
          })
          .catch((error) => {
            const errorDescription = error.response.data.message;
            setErrorMessage(errorDescription);
          });
      } else {
        setErrorMessage("User not logged in");
      }
    };

    getStudent();
  }, [user._id]);

  if (errorMessage) return <div>{errorMessage}</div>;

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      {userProfile && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "24px",
            position: "relative",
          }}
        >
          <img
            src=""
            alt="profile-photo"
            style={{
              borderRadius: "50%",
              width: "128px",
              height: "128px",
              objectFit: "cover",
              border: "2px solid #D1D5DB" /* gray-300 */,
            }}
          />
          <h1
            style={{
              fontSize: "24px",
              marginTop: "16px",
              fontWeight: "bold",
              position: "absolute",
            }}
          >
            {userProfile.name}
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "24px",
              marginTop: "96px",
              marginBottom: "16px",
              borderBottom: "1px solid #E5E7EB" /* gray-200 */,
              paddingBottom: "16px",
            }}
          >
            <p
              style={{
                textAlign: "left",
                marginBottom: "8px",
                borderBottom: "1px solid #E5E7EB" /* gray-200 */,
                paddingBottom: "8px",
              }}
            >
              <strong>Email:</strong> {userProfile.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilPage;
