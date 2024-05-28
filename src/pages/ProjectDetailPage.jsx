import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

function ProjectDetailPage() {
  const { user } = useContext(AuthContext);
  const { creatorId, projectId } = useParams();
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);

  useEffect(() => {
    console.log("AuthContext user:", user); // Log the user object to debug
  }, [user]);

  const fetchProjectData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/creators/${creatorId}/projects/${projectId}?populate=options&populate=creator`
      );
      console.log("Project data fetched:", response.data); // Log the project data
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
    fetchProjectData();
  }, [projectId]);

  const handleEditClick = () => {
    navigate(`/projects/${creatorId}/${currentProject._id}/edit`, {
      state: { refresh: true },
    });
  };

  const handleVoteClick = () => {
    setIsVotingModalOpen(true);
  };

  const closeModal = () => {
    setIsVotingModalOpen(false);
  };

  const submitVote = (optionId) => {
    // Implement vote submission logic here
    console.log("Voted for option:", optionId);
    closeModal();
  };

  return (
    <div style={styles.container}>
      {isLoading ? (
        <div>Loading...</div>
      ) : errorMessage ? (
        <div style={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <div>
          {currentProject.image && (
            <img
              src={currentProject.image}
              alt={currentProject.title}
              style={styles.projectImage}
            />
          )}
          <h1>{currentProject.title}</h1>
          <p>{currentProject.description}</p>
          <h3>
            Created by:{" "}
            <Link to={`/creators/${currentProject.creator._id}`}>
              {currentProject.creator?.name}
            </Link>
          </h3>
          <h3>Voting Options</h3>
          <div style={styles.optionsContainer}>
            {currentProject.options && currentProject.options.length > 0 ? (
              currentProject.options.map((option, index) => (
                <div key={index} style={styles.optionCard}>
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.title}
                      style={styles.optionImage}
                    />
                  )}

                  <h4>{option.title}</h4>
                  <p>{option.description}</p>
                </div>
              ))
            ) : (
              <p>No options available for this project.</p>
            )}
          </div>
          <div>
            {user &&
              currentProject.creator &&
              user._id === currentProject.creator._id && (
                <button style={styles.editButton} onClick={handleEditClick}>
                  Edit Project
                </button>
              )}
          </div>
          <div>
            {user && user.role === "fans" && (
              <button style={styles.editButton} onClick={handleVoteClick}>
                Vote Now!
              </button>
            )}
          </div>
        </div>
      )}

      {isVotingModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Vote for an Option</h2>
            <button style={styles.closeButton} onClick={closeModal}>
              X
            </button>
            <div style={styles.optionsContainer}>
              {currentProject.options.map((option, index) => (
                <div key={index} style={styles.optionCard}>
                  <img
                    src={option.image}
                    alt={option.title}
                    style={styles.optionImage}
                  />
                  <h4>{option.title}</h4>
                  <p>{option.description}</p>
                  <button
                    style={styles.voteButton}
                    onClick={() => submitVote(option._id)}
                  >
                    Vote for this option
                  </button>
                </div>
              ))}
            </div>
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
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    maxWidth: "600px",
    width: "100%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  voteButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default ProjectDetailPage;
