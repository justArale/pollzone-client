import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

// Import the string from the .env with URL of the API/server - http://localhost:5005
const API_URL = import.meta.env.VITE_API_URL;

function ProjectDetailPage() {
  const { user, authenticateUser } = useContext(AuthContext);
  const { creatorId, projectId } = useParams();
  const [currentProject, setCurrentProject] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext user:", user); // Log the user object to debug
  }, [user]);

  const fetchUserData = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      setErrorMessage("No authentication token found");
      setIsLoading(false);
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
    } catch (error) {
      console.error("Error fetching user data:", error);
      const errorDescription =
        error.response?.data?.message ||
        "An error occurred while fetching user data";
      setErrorMessage(errorDescription);
    }
  };

  const fetchProjectData = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      setErrorMessage("No authentication token found");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/api/creators/${creatorId}/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setCurrentProject(response.data);
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
    if (!user) {
      authenticateUser();
    } else if (user && user.role && user._id && creatorId && projectId) {
      fetchUserData();
      fetchProjectData();
    }
  }, [user, creatorId, projectId]);

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div>Loading...</div>
      ) : errorMessage ? (
        <div style={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <div>
          <h1>{currentProject.title}</h1>
          <p>{currentProject.description}</p>
          {currentProject.image && (
            <img
              src={currentProject.image}
              alt={currentProject.title}
              style={styles.projectImage}
            />
          )}
          <h3>Options</h3>
          <div style={styles.optionsContainer}>
            {currentProject.options && currentProject.options.length > 0 ? (
              currentProject.options.map((option, index) => (
                <div key={index} style={styles.optionCard}>
                  <h4>{option.title}</h4>
                  {option.image && (
                    <img src={option.image} alt={option.title} style={styles.optionImage} />
                  )}
                  <p>{option.description}</p>
                </div>
              ))
            ) : (
              <p>No options available for this project.</p>
            )}
          </div>
          {/* ONLY WHEN CREATOR */}
          <div>
            {currentProject.creator === creatorId && (
              <Link to={`/projects/${creatorId}/${currentProject._id}/edit`}>
                <button style={styles.editButton}>Edit Project</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  projectImage: {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
    marginTop: "10px",
  },
  errorMessage: {
    color: "red",
    marginTop: "10px",
  },
  optionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "20px",
  },
  optionCard: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    width: "calc(50% - 20px)",
    boxSizing: "border-box",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  optionImage: {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
    marginTop: "10px",
  },
  editButton: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default ProjectDetailPage;
