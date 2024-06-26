import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import "../components/CreatorDetailPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultImage from "../assets/images/Avatar.svg";

const API_URL = import.meta.env.VITE_API_URL;

function CreatorDetailPage() {
  const { user, authenticateUser } = useContext(AuthContext);
  const { creatorId } = useParams();
  const [currentCreator, setCurrentCreator] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const notifySubmit = () =>
    toast(`You successfully follow ${currentCreator.name}, NICE!`);
  const notifyDelete = () =>
    toast(`Successfully unfollow ${currentCreator.name}!`);

  const fetchCreatorData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/creators/${creatorId}`);
      console.log("Creator data fetched:", response.data);
      setCurrentCreator(response.data);
    } catch (error) {
      console.error("Error fetching creator data:", error);
      const errorDescription =
        error.response?.data?.message ||
        "An error occurred while fetching creator data";
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (!user || !user.role || !user._id) {
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/api/${user.role}/${user._id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setCurrentUser(response.data);
      console.log("User: ", response.data);

      if (response.data.favoritCreators) {
        const favoriteCreatorIds = response.data.favoritCreators.map(
          (creator) => creator._id
        );
        if (favoriteCreatorIds.includes(creatorId)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      const errorDescription =
        error.response?.data?.message ||
        "An error occurred while fetching user data";
      setErrorMessage(errorDescription);
    }
  };

  const handleFollowToggle = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${API_URL}/api/creators/${creatorId}/fans/${user._id}/toggleFollow`,
        {},
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      // Toggle the follow state
      const updatedIsFollowing = !isFollowing;
      setIsFollowing(updatedIsFollowing);
      isFollowing ? notifyDelete() : notifySubmit();

      // Update the user's favoriteCreators in AuthContext
      authenticateUser();
    } catch (error) {
      console.error("Error updating follow status:", error);
      const errorDescription =
        error.response?.data?.message ||
        "An error occurred while updating follow status";
      setErrorMessage(errorDescription);
    }
  };

  useEffect(() => {
    fetchCreatorData();
    if (user) {
      fetchUserData();
    }
  }, [creatorId, user]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      {currentCreator && (
        <div className="creatorDetailPage">
          <div className="flexTry">
            <div className="userCard">
              <img
                src={currentCreator.image || defaultImage}
                alt="profile-photo"
                className="userImageCard"
              />

              <div className="userCardInfo">
                <h1 className="pageTitle">{currentCreator.name}</h1>
                <p className="bodyLarge secondaryColor">
                  {currentCreator.description}
                </p>
                <div className="creatorSubInfo">
                  <h2 className="bodyLink">
                    {currentCreator.fans?.length || 0} Follower
                  </h2>
                  <div className="bodyLarge">•</div>
                  {currentCreator.socialMedia &&
                  currentCreator.socialMedia.length > 0 ? (
                    currentCreator.socialMedia.map((link, index) => (
                      <p key={index} className="webpageLink bodyLink">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </a>
                      </p>
                    ))
                  ) : (
                    <p className="webpageLink bodyLink">No Website</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              {user && user.role === "fans" && (
                <button
                  onClick={handleFollowToggle}
                  className={`button buttonPrimaryLarge buttonFont buttonFontReverse ${
                    isFollowing ? "unfollow" : "follow"
                  }`}
                >
                  {isFollowing ? "Unfollow" : `Follow`}
                </button>
              )}
            </div>
          </div>
          <div className="userDetail">
            <h2 className="sectionTitle">Projects</h2>
            <div className="projectsContainer">
              {currentCreator.projects && currentCreator.projects.length > 0 ? (
                currentCreator.projects.map((project, index) => (
                  <Link
                    to={`/projects/${currentCreator._id}/${project._id}`}
                    key={index}
                    className="projectCard"
                  >
                    <h3 className="title primaryColor">{project.title}</h3>
                    <p className="body secondaryColor">{project.description}</p>
                  </Link>
                ))
              ) : (
                <p>No projects found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatorDetailPage;
