import "../../components/UserProfilPage.css";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import defaultProfilePicture from "../../assets/images/defaultProfilPicture.png";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/auth.context";
import { Link, useNavigate } from "react-router-dom";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

function UserProfilPage() {
  const [userProfile, setUserProfile] = useState(null);
  const { isLoggedIn, logOutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(undefined);

  const notifyDelete = () => toast("Successfully deleted!");

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

  const handleDeleteClick = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      const response = await axios.delete(
        userProfile.role === "creators"
          ? `${API_URL}/api/creators/${userProfile._id}`
          : `${API_URL}/api/fans/${userProfile._id}`,

        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      console.log("Deleted:", response.data);
      notifyDelete();
      logOutUser();
      navigate(`/`);
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("An error occurred while deleting the user.");
    }
  };

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
            <p>Webside :</p>

            {userProfile.socialMedia &&
              userProfile.socialMedia.map((link, index) => (
                <div key={index} className="webpageLink">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </div>
              ))}
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
          <div className="buttonGroup">
            <Link to={"/profile/edit"} className="detailPageButtons">
              <button className="button buttonSmall buttonReverse">
                <img src={editIcon} alt="Edit Icon" /> Edit
              </button>
            </Link>

            <button
              className="button buttonSmall buttonDelete"
              onClick={handleDeleteClick}
            >
              <img src={deleteIcon} alt="Delete Icon" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilPage;
