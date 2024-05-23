import { useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../context/auth.context";
import { Link, useNavigate } from "react-router-dom";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

function UserProfilPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    const getUser = () => {
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

    getUser();
  }, [user._id, user.role]);

  if (errorMessage) return <div>{errorMessage}</div>;

  if (loading) return <div>Loading...</div>;

  return (
    <div>
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
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            <img
              src={userProfile.image || ""}
              alt="profile-photo"
              style={{
                borderRadius: "50%",
                width: "128px",
                height: "128px",
                objectFit: "cover",
                border: "2px solid #D1D5DB" /* gray-300 */,
                margin: "0 auto",
              }}
            />
            <h1
              style={{
                fontSize: "24px",
                marginTop: "16px",
                fontWeight: "bold",
              }}
            >
              {userProfile.name}
            </h1>
            <h2
              style={{
                fontSize: "18px",
                marginTop: "8px",
                color: "#555",
              }}
            >
              {userProfile.role.charAt(0).toUpperCase() +
                userProfile.role.slice(1, userProfile.role.length-1)}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
                marginTop: "16px",
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
                <strong>Description:</strong> {userProfile.description}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
                marginTop: "16px",
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

            {userProfile.role === "creators" && (
              <div
                style={{
                  textAlign: "left",
                  marginTop: "16px",
                }}
              >
                <p><strong>Followers:</strong> {userProfile.fans.length}</p>
                <p style={{ fontWeight: "bold" }}>Social Media:</p>
                <ul style={{ paddingLeft: "20px" }}>
                  {userProfile.socialMedia &&
                    userProfile.socialMedia.map((link, index) => (
                      <li key={index} style={{ listStyleType: "disc" }}>
                        <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
                          {link}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <Link to={"/profile/edit"}>
              <button style={{ fontWeight: "bold", padding: "10px", background: "purple", color: "white" }}>Edit Profile</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilPage;
