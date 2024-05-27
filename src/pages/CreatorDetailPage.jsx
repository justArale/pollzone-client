import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

function CreatorDetailPage() {
  const { user, authenticateUser } = useContext(AuthContext);
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [currentCreator, setCurrentCreator] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchCreatorData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/creators/${creatorId}`);
      console.log("Creator data fetched:", response.data);
      setCurrentCreator(response.data);

      // Ensure that user.favoriteCreators is defined before using it
      if (
        user &&
        user.favoriteCreators &&
        user.favoriteCreators.includes(creatorId)
      ) {
        setIsFollowing(true);
      }
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

  const handleFollowToggle = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await axios.put(
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

      // Update the currentCreator's fans count
      setCurrentCreator((prevCreator) => ({
        ...prevCreator,
        fans: updatedIsFollowing
          ? [...prevCreator.fans, user._id]
          : prevCreator.fans.filter((fanId) => fanId !== user._id),
      }));
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
  }, [creatorId, user]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div style={styles.container}>
      <img
        src={currentCreator.image}
        alt={currentCreator.name}
        style={styles.image}
      />
      <h1 style={styles.name}>{currentCreator.name}</h1>
      <p style={styles.description}>{currentCreator.description}</p>
      <h2 style={styles.subheader}>
        Followers: {currentCreator.fans?.length || 0}
      </h2>
      <h2 style={styles.subheader}>Social Media</h2>
      {currentCreator.socialMedia &&
        currentCreator.socialMedia.map((link, index) => (
          <a
            key={index}
            href={link}
            style={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link}
          </a>
        ))}
      {user && user.role === "fans" && (
        <button onClick={handleFollowToggle}>
          {isFollowing
            ? "Unfollow"
            : `Follow ${currentCreator.name} on Pollzone!`}
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
  },
  name: {
    fontSize: "2em",
    margin: "20px 0",
  },
  description: {
    fontSize: "1.2em",
    margin: "20px 0",
  },
  subheader: {
    fontSize: "1.2em",
    margin: "20px 0 10px 0",
  },
  socialLink: {
    display: "block",
    margin: "5px 0",
    color: "#007bff",
    textDecoration: "none",
  },
};

export default CreatorDetailPage;
