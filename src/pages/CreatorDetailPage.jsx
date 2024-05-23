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

  const fetchCreatorData = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      setErrorMessage("No authentication token found");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/api/creators/${creatorId}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setCurrentCreator(response.data);
    } catch (error) {
      console.error("Error fetching project data:", error);
      const errorDescription =
        error.response?.data?.message ||
        "An error occurred while fetching project data";
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();
  }, [creatorId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div style={styles.container}>
      <img src={currentCreator.image} alt={currentCreator.name} style={styles.image} />
      <h1 style={styles.name}>{currentCreator.name}</h1>
      <p style={styles.description}>{currentCreator.description}</p>
      <h2 style={styles.subheader}>Followers: {currentCreator.fans?.length || 0}</h2>
      <h2 style={styles.subheader}>Social Media</h2>
      {currentCreator.socialMedia.map((link, index) => (
        <a key={index} href={link} style={styles.socialLink} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
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
