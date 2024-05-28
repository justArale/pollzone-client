import "../components/ProjectDetailPage.css";
import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

function ProjectDetailPage() {
  const { user } = useContext(AuthContext);
  const { creatorId, projectId } = useParams();
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [chosenVote, setChosenVote] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [timer, setTimer] = useState("");
  const [isVotingClosed, setIsVotingClosed] = useState(false);

  const notifySubmit = () =>
    toast("You submitted your vote successfully, SWEET!");
  const notifyDelete = () => toast("Successfully deleted!");

  useEffect(() => {
    if (user) {
      console.log("AuthContext user:", user);
      if (user.votes) {
        console.log("User votes:", user.votes);
      }
    }
  }, [user]);

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
    } catch (error) {
      console.error("Error fetching user data:", error);
      const errorDescription =
        error.response?.data?.message ||
        "An error occurred while fetching user data";
      setErrorMessage(errorDescription);
      setIsLoading(false);
    }
  };

  const fetchProjectData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/creators/${creatorId}/projects/${projectId}?populate=options&populate=creator`
      );
      setCurrentProject(response.data);
      console.log("Project: ", response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching project data:", error);
      const errorDescription =
        error.response?.data?.message ||
        "An error occurred while fetching project data";
      setErrorMessage(errorDescription);
      setIsLoading(false);
    }
  };

  const checkIfUserHasVoted = (options) => {
    if (currentUser && currentUser.votes) {
      const userVotes = currentUser.votes.map((vote) => vote._id.toString());
      const userHasVoted = options.some((option) => {
        const optionId = option._id.toString();
        return userVotes.includes(optionId);
      });
      setHasVoted(userHasVoted);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await fetchUserData();
      }
      await fetchProjectData();
    };

    fetchData();
  }, [projectId, user]);

  useEffect(() => {
    if (currentUser && currentProject.options) {
      checkIfUserHasVoted(currentProject.options);
    }
  }, [currentUser, currentProject]);

  useEffect(() => {
    if (currentProject.startDate && currentProject.timeCount) {
      const startDate = new Date(currentProject.startDate);

      const endDate = new Date(startDate.getTime() + currentProject.timeCount * 3600000);


      const updateTimer = () => {
        const now = new Date();

        if (now < startDate) {
          setTimer("Voting period has not started yet");
        } else {
          const timeRemaining = endDate - now;

          if (timeRemaining > 0) {
            const hours = Math.floor(timeRemaining / 3600000);
            const minutes = Math.floor((timeRemaining % 3600000) / 60000);
            const seconds = Math.floor((timeRemaining % 60000) / 1000);

            setTimer(`${hours}h ${minutes}m ${seconds}s`);
            setIsVotingClosed(false);
          } else {
            setTimer("Voting closed");
            setIsVotingClosed(true);
          }
        }
      };

      updateTimer(); // Initialize timer immediately

      const timerInterval = setInterval(updateTimer, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [currentProject.startDate, currentProject.timeCount]);

  const handleEditClick = () => {
    navigate(`/projects/${creatorId}/${currentProject._id}/edit`, {
      state: { refresh: true },
    });
  };

  const handleDeleteClick = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await axios.delete(
        `${API_URL}/api/creators/${creatorId}/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      console.log("Deleted:", response.data);
      notifyDelete();
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error deleting project:", error);
      setErrorMessage("An error occurred while deleting the project.");
    }
  };

  const handleVoteClick = () => {
    setIsVotingModalOpen(true);
  };

  const closeModal = () => {
    setIsVotingModalOpen(false);
  };

  const submitVote = async (optionId) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await axios.put(
        `${API_URL}/api/creators/${creatorId}/projects/${projectId}/options/${optionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      console.log("Vote submitted:", response.data);
      setHasVoted(true);
      notifySubmit();
    } catch (error) {
      console.error("Error submitting vote:", error);
      setErrorMessage("An error occurred while submitting your vote.");
    } finally {
      closeModal();
    }
  };

  const chooseVote = (optionId) => {
    setChosenVote(optionId);
  };

  const formatDate = (dateString) => {
    const dateOptions = { year: "numeric", month: "numeric", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const date = new Date(dateString);
    return `${date.toLocaleDateString(
      undefined,
      dateOptions
    )}, ${date.toLocaleTimeString(undefined, timeOptions)}`;
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : errorMessage ? (
        <div style={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <div>
          <div className="projectBox">
            <div className="projectHeaderBox">
              <div className="rectangle"></div>
              <div className="projectHeadline">
                <h1 className="projectHeader">{currentProject.title}</h1>
                <p className="projectDescription">
                  {currentProject.description}
                </p>
              </div>
            </div>
            {user &&
              currentProject.creator &&
              user._id === currentProject.creator._id && (
                <div className="detailPageButtons">
                  <button
                    className="button buttonSmall buttonReverse"
                    onClick={handleEditClick}
                  >
                    Edit Project
                  </button>
                  <button
                    className="button buttonSmall buttonDelete"
                    onClick={handleDeleteClick}
                  >
                    Delete Project
                  </button>
                </div>
              )}
          </div>

          <h3>
            Created by:{" "}
            <Link to={`/creators/${currentProject.creator._id}`}>
              {currentProject.creator?.name}
            </Link>
          </h3>
          <h3>Voting Start: {formatDate(currentProject.startDate)}</h3>
          <h3>
            TIME LEFT TO VOTE: <span style={styles.highlight}>{timer}</span>
          </h3>
          <h2>Voting Options</h2>
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
          <div></div>
          <div>
            {user && user.role === "fans" && (
              <button
                className={`button buttonSmall ${
                  hasVoted || isVotingClosed ? "buttonClosed" : ""
                }`}
                onClick={hasVoted || isVotingClosed ? null : handleVoteClick}
                disabled={hasVoted || isVotingClosed}
              >
                {hasVoted
                  ? "You already voted"
                  : isVotingClosed
                  ? "Voting Closed"
                  : "Vote Now!"}
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
                <div key={index} style={styles.optionCardSmall}>
                  <img
                    src={option.image}
                    alt={option.title}
                    style={styles.optionImage}
                  />
                  <h4>{option.title}</h4>
                  <p>{option.description}</p>
                  <button
                    style={{
                      ...styles.voteButton,
                      backgroundColor:
                        chosenVote === option._id ? "green" : "aquamarine",
                    }}
                    onClick={() => chooseVote(option._id)}
                  >
                    Choose this option
                  </button>
                </div>
              ))}
              <button
                style={styles.submitButton}
                onClick={() => submitVote(chosenVote)}
              >
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
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
  optionCardSmall: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    width: "calc(50% - 20px)",
    boxSizing: "border-box",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "180px",
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
    backgroundColor: "aquamarine",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  highlight: {
    color: "teal",
  },
};

export default ProjectDetailPage;
