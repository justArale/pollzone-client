import "../../components/UserProfilPage.css";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import defaultProfilePicture from "../../assets/images/Avatar.svg";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import defaultImage from "../../assets/images/Avatar.svg";
import closeIcon from "../../assets/icons/close.svg";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDeleteModel = () => {
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

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
              src={userProfile.image || defaultImage}
              alt={`${user.name}'s profile`}
              className="userImageCard"
            />
            <div>
              <h1 className="headline">{userProfile.name}</h1>
              <p className="bodyLarge secondaryColor">
                {userProfile.role.charAt(0).toUpperCase() +
                  userProfile.role.slice(1, userProfile.role.length - 1)}
              </p>
            </div>
          </div>

          <div>
            <p className="body">Email: {userProfile.email}</p>
          </div>
          <div>
            <p className="body">Website:</p>

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
                <p className="body">Description: {userProfile.description}</p>
              </div>
              <div>
                <p className="body">Follower:{userProfile.fans.length}</p>
              </div>
            </div>
          )}
          <div className="buttonGroup">
            <Link to={"/profile/edit"} className="detailPageButtons">
              <button className="button buttonSecondarySmall buttonFont">
                <img src={editIcon} alt="Edit Icon" /> Edit
              </button>
            </Link>

            <button
              className="button awareButtonSmall buttonFont buttonFontReverse"
              onClick={handleDeleteModel}
            >
              <img src={deleteIcon} alt="Delete Icon" /> Delete
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="submitOverlay" onClick={closeModal}>
          <div className="deleteModal">
            <img
              src={closeIcon}
              alt="close Icon"
              className="closeIcon"
              onClick={closeModal}
            />

            <div className="deleteModelContent">
              <h3 className="title">Delete Profile</h3>
              <p className="body">Are you sure to delete your profile?</p>
              <button
                className="button buttonPrimaryLarge awareButtonSmall buttonFontReverse buttonFont"
                onClick={() => handleDeleteClick()}
              >
                Delete now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilPage;
