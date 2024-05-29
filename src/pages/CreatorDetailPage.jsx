import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import "../components/CreatorDetailPage.css"; // Import the CSS file

const API_URL = import.meta.env.VITE_API_URL;

function CreatorDetailPage() {
  const { user, authenticateUser } = useContext(AuthContext);
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [currentCreator, setCurrentCreator] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

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
        error.response?.data?.message || "An error occurred while fetching user data";
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
    <div className="container">
      {currentCreator.image && (
        <img
          src={currentCreator.image}
          alt={currentCreator.name}
          className="image"
        />
      )}

      <h1 className="name">{currentCreator.name}</h1>
      <p className="description">{currentCreator.description}</p>
      <h2 className="subheader">
        Followers: {currentCreator.fans?.length || 0}
      </h2>
      <h2 className="subheader">Social Media</h2>
      {currentCreator.socialMedia &&
        currentCreator.socialMedia.map((link, index) => (
          <a
            key={index}
            href={link}
            className="socialLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link}
          </a>
        ))}
      {user && user.role === "fans" && (
        <button
          onClick={handleFollowToggle}
          className={`followButton ${isFollowing ? "unfollow" : "follow"}`}
        >
          {isFollowing
            ? "Unfollow"
            : `Follow ${currentCreator.name} on PollZone!`}
        </button>
      )}
    </div>
  );
}

export default CreatorDetailPage;
