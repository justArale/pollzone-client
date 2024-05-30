import "../../components/UserProfilPage.css";
import editIcon from "../../assets/icons/edit.svg";
import defaultProfilePicture from "../../assets/images/defaultProfilPicture.png";
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
      {userProfile && (
        <div className="userDetail">
          <div className="userCard">
            <img
              src={
                userProfile.image === ""
                  ? defaultProfilePicture
                  : userProfile.image
              }
              alt="profile-photo"
              className="userImageCard"
            />
            <div>
              <h1 className="userName">{userProfile.name}</h1>
              <p className="userRole">
                {userProfile.role.charAt(0).toUpperCase() +
                  userProfile.role.slice(1, userProfile.role.length - 1)}
              </p>
            </div>
          </div>

          <div>
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
          </div>
          <div>
            <p>Webside</p>
            <ul>
              {userProfile.socialMedia &&
                userProfile.socialMedia.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {userProfile.role === "creators" && (
            <div>
              <div>
                <p>
                  <strong>Description:</strong> {userProfile.description}
                </p>
              </div>
              <div>
                <p>
                  <strong>Follower:</strong> {userProfile.fans.length}
                </p>
              </div>
            </div>
          )}
          <Link to={"/profile/edit"} className="detailPageButtons">
            <button className="button buttonSmall buttonReverse">
              <img src={editIcon} alt="Edit Icon" /> Edit Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default UserProfilPage;
