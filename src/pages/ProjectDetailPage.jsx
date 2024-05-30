import "../components/ProjectDetailPage.css";
import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit.svg";
import searchIcon from "../assets/icons/search.svg";
import closeIcon from "../assets/icons/close.svg";
import CreatorCard from "../components/CreatorCard";

const API_URL = import.meta.env.VITE_API_URL;

function ProjectDetailPage() {
  const { user } = useContext(AuthContext);
  const { creatorId, projectId } = useParams();
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [isImageFocusOpen, setIsImageFocusOpen] = useState(false);
  const [chosenVote, setChosenVote] = useState("");
  const [bigImage, setBigImage] = useState("");
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
        console.log("Option Id:", option._id);
        console.log("User voted:", currentUser.votes);
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

      const endDate = new Date(
        startDate.getTime() + currentProject.timeCount * 3600000
      );

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

            const formattedHours = ("0" + hours).slice(-2);
            const formattedMinutes = ("0" + minutes).slice(-2);
            const formattedSeconds = ("0" + seconds).slice(-2);

            setTimer(
              `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
            );
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

  const handleVoteClick = (option) => {
    setChosenVote(option);
    setIsVotingModalOpen(true);
  };

  const handleImageFocus = (image) => {
    console.log("Big Image!");
    console.log("Image:", image);
    setBigImage(image);
    setIsImageFocusOpen(true);
  };

  const closeModal = () => {
    setIsVotingModalOpen(false);
    setIsImageFocusOpen(false);
  };

  useEffect(() => {
    // Event-Listener to close the overlay if you click outside
    const handleClickOutside = (event) => {
      if (isVotingModalOpen && !event.target.closest(".submitModal")) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isVotingModalOpen,
    !isVotingModalOpen,
    isImageFocusOpen,
    !isImageFocusOpen,
  ]);

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
        <div>{errorMessage}</div>
      ) : (
        <div className="PollDetails">
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
                    <img src={editIcon} alt="Edit Icon" />
                    Edit
                  </button>
                  <button
                    className="button buttonSmall buttonDelete"
                    onClick={handleDeleteClick}
                  >
                    <img src={deleteIcon} alt="Delete Icon" />
                    Delete
                  </button>
                </div>
              )}
          </div>

          {currentProject.creator._id !== currentUser._id && (
            <CreatorCard currentProject={currentProject} />
          )}
          <div className="voteDetails">
            <div className="voteInfoBox">
              {(user &&
                currentProject.creator &&
                user._id === currentProject.creator._id) ||
              (isVotingClosed &&
                new Date(currentProject.startDate) < new Date()) ? (
                <h3 className="voteInfo">Results</h3>
              ) : !isVotingClosed &&
                new Date(currentProject.startDate) > new Date() ? (
                <h3 className="voteInfo">
                  Voting Start: {formatDate(currentProject.startDate)}
                </h3>
              ) : (
                <h3 className="voteInfo">Vote now</h3>
              )}
              {!isVotingClosed &&
              new Date(currentProject.startDate) < new Date() ? (
                <div className="timeWrapper">
                  <span className="spanTime">time left:</span>
                  <div className="countdown">{timer}</div>
                </div>
              ) : (
                <span className="spanTime">Voting ended</span>
              )}
            </div>
            <div className="optionsContainer">
              {currentProject.options && currentProject.options.length > 0 ? (
                currentProject.options.map((option, index) => (
                  <div key={index} className="optionCard">
                    {option.image && (
                      <div className="optionImage">
                        <img src={option.image} alt={option.title} />
                      </div>
                    )}

                    {option.image && (
                      <div
                        className="searchIcon"
                        onClick={() => {
                          handleImageFocus(option.image);
                        }}
                      >
                        <img src={searchIcon} />
                      </div>
                    )}
                    <div className="optionInfoBox">
                      <h4 className="optionTitle">{option.title}</h4>
                      <p className="optionDescription">{option.description}</p>
                      <div className="spacer"></div>
                      <div>
                        {user && user.role === "fans" && (
                          <button
                            className={`button buttonSmall buttonVote ${
                              hasVoted || isVotingClosed ? "buttonClosed" : ""
                            }`}
                            onClick={
                              hasVoted || isVotingClosed
                                ? null
                                : () => handleVoteClick(option)
                            }
                            disabled={hasVoted || isVotingClosed}
                          >
                            {hasVoted
                              ? "You already voted"
                              : isVotingClosed
                              ? "Voting Closed"
                              : "Vote this!"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No options available for this project.</p>
              )}
            </div>
            <div></div>
          </div>
        </div>
      )}

      {isVotingModalOpen && (
        <div className="submitOverlay" onClick={closeModal}>
          <div className="submitModal">
            <img
              src={closeIcon}
              alt="close Icon"
              className="closeIcon"
              onClick={closeModal}
            />

            <h2>Vote for: {chosenVote.title} </h2>
            <div>
              <button
                className="button buttonLarge buttonSubmit"
                onClick={() => submitVote(chosenVote._id)}
              >
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {isImageFocusOpen && (
        <div className="submitOverlay" onClick={closeModal}>
          <div className="submitModal">
            <img
              src={closeIcon}
              alt="close Icon"
              className="closeIcon"
              onClick={closeModal}
            />

            <img src={bigImage} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetailPage;
