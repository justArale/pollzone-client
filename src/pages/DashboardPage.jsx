import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [fan, setFan] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserData = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `${API_URL}/api/${user.role}/${user._id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setCurrentUser(response.data);
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  const fetchUserProjects = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `${API_URL}/api/${user.role}/${user._id}/projects`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setProjects(response.data);
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  const fetchFanData = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${API_URL}/api/fans/${user._id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setFan(response.data);
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  useEffect(() => {
    if (user && user.role && user._id) {
      fetchUserData();
      if (user.role === "creators") {
        fetchUserProjects();
      } else {
        fetchFanData();
      }
    }
  }, [user]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {currentUser.name ? (
          <h1 style={styles.headline}>Hi {currentUser.name}!</h1>
        ) : (
          <div style={styles.loading}>Loading...</div>
        )}
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      </div>
      <div>
        {currentUser.role === "creators" ? (
          <div>
            <div style={styles.createButtonContainer}>
              <Link to="/projects/create">
                <button style={styles.createButton}>
                  + Create New Project
                </button>
              </Link>
            </div>
            <div>
              <h1 style={styles.headline}>MY PROJECTS</h1>
              <div style={styles.projectsContainer}>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project.creator}/${project._id}`}
                      style={styles.link}
                    >
                      <div style={styles.projectCard}>
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            style={styles.projectImage}
                          />
                        )}
                        <h2 style={styles.projectTitle}>{project.title}</h2>
                        <p style={styles.projectDescription}>
                          {project.description}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p style={styles.noProjectsMessage}>No projects found.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 style={styles.headline}>My Votes</h1>
            <div style={styles.projectsContainer}>
              {fan.votes && fan.votes.length > 0 ? (
                fan.votes.map((vote) => (
                  <div key={vote._id} style={styles.projectCard}>
                    <h2 style={styles.projectTitle}>{vote.title}</h2>
                    <p style={styles.projectDescription}>{vote.description}</p>
                  </div>
                ))
              ) : (
                <p style={styles.noProjectsMessage}>No votes found.</p>
              )}
            </div>
            <div style={styles.projectsContainer}>
              {fan.favoritCreators && fan.favoritCreators.length > 0 ? (
                fan.favoritCreators.map((creator) => (
                  <div key={creator._id} style={styles.projectCard}>
                    <h2 style={styles.projectTitle}>{creator.name}</h2>
                    <p style={styles.projectDescription}>
                      {creator.description}
                    </p>
                    <img
                      src={creator.image}
                      alt={creator.name}
                      style={styles.projectImage}
                    />
                  </div>
                ))
              ) : (
                <p style={styles.noProjectsMessage}>
                  No favorite creators found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    marginBottom: "20px",
    textAlign: "center",
  },
  greeting: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  loading: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  createButtonContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  createButton: {
    padding: "15px 25px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  createButtonHover: {
    backgroundColor: "#218838",
  },
  headline: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "20px",
  },
  projectsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  projectCard: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  projectCardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
  },
  projectTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  projectDescription: {
    fontSize: "14px",
    marginBottom: "10px",
  },
  projectImage: {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
    marginTop: "10px",
  },
  noProjectsMessage: {
    fontSize: "18px",
    color: "#777",
    textAlign: "center",
    width: "100%",
  },
  errorMessage: {
    color: "red",
    marginTop: "10px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
};

export default DashboardPage;
