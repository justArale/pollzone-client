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
import checkIcon from "../assets/icons/check.svg";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageFocusOpen, setIsImageFocusOpen] = useState(false);
  const [chosenVote, setChosenVote] = useState("");
  const [bigImage, setBigImage] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [userChoice, setUserChoice] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [timer, setTimer] = useState("");
  const [isVotingClosed, setIsVotingClosed] = useState(false);
  const [highestVote, setHighestVote] = useState();

  const notifySubmit = () =>
    toast("You submitted your vote successfully, SWEET!");
  const notifyDelete = () => toast("Project successfully deleted!");

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

      console.log("User votes:", userVotes);
      console.log("Project options:", options);

      const userHasVoted = options.some((option) => {
        const optionId = option._id.toString();
        return userVotes.includes(optionId);
      });

      console.log("User has voted:", userHasVoted);

      if (userHasVoted) {
        const votedOption = options.find((option) =>
          userVotes.includes(option._id.toString())
        );
        if (votedOption) {
          setUserChoice(votedOption._id.toString());
          console.log("User voted for option:", votedOption);
        }
      }

      setHasVoted(userHasVoted);
    }
  };

  useEffect(() => {
    if (currentProject && currentProject.options) {
      let mostVotes = 0;
      currentProject.options.forEach((option) => {
        if (option.counter > mostVotes) {
          mostVotes = option._id;
        }
      });
      console.log(mostVotes);

      setHighestVote(mostVotes);
    }
  }, [currentProject]);

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
      console.log(hasVoted);
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

  const handleDeleteModel = () => {
    setIsDeleteModalOpen(true);
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
    setIsDeleteModalOpen(false);
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
  }, [isVotingModalOpen, isImageFocusOpen]);

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
      window.location.reload();
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

  const getOptionCardClass = (option) => {
    if (hasVoted && userChoice === option._id.toString()) {
      return "optionCard votedCard";
    }
    if (
      currentProject.creator._id === currentUser._id &&
      highestVote === option._id
    ) {
      return "optionCard votedCard";
    }
    return "optionCard";
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
                <h1 className="headline">{currentProject.title}</h1>
                <p className="bodyLarge secondaryColor">
                  {currentProject.description}
                </p>
              </div>
            </div>
            {user &&
              currentProject.creator &&
              user._id === currentProject.creator._id && (
                <div className="buttonGroup">
                  <button
                    className={`button buttonSecondarySmall buttonFont ${
                      currentProject.options.some(
                        (option) => option.counter > 0
                      )
                        ? "buttenNoDrop"
                        : ""
                    }`}
                    onClick={
                      currentProject.options.some(
                        (option) => option.counter > 0
                      )
                        ? null
                        : handleEditClick
                    }
                    disabled={currentProject.options.some(
                      (option) => option.counter > 0
                    )}
                  >
                    <img src={editIcon} alt="Edit Icon" />
                    Edit
                  </button>
                  <button
                    className="button awareButtonSmall buttonFont buttonFontReverse"
                    onClick={handleDeleteModel}
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
              {user &&
              currentProject.creator &&
              user._id === currentProject.creator._id &&
              !new Date(currentProject.startDate) > new Date() ? (
                <h3 className="sectionTitle">Results</h3>
              ) : isVotingClosed ? (
                <h3 className="sectionTitle">Results</h3>
              ) : new Date(currentProject.startDate) > new Date() ? (
                <h3 className="sectionTitle">
                  Voting Start: {formatDate(currentProject.startDate)}
                </h3>
              ) : (
                <h3 className="sectionTitle">Vote now</h3>
              )}
              {!isVotingClosed &&
              new Date(currentProject.startDate) < new Date() ? (
                <div className="timeWrapper">
                  <span className="label">time left:</span>
                  <div className="countdown">{timer}</div>
                </div>
              ) : isVotingClosed ? (
                <span className="spanTime">Voting ended</span>
              ) : null}
            </div>

            <div className="optionsContainer">
              {currentProject.options && currentProject.options.length > 0 ? (
                currentProject.options.map((option, index) => (
                  <div
                    key={index}
                    className={`optionCard ${
                      (hasVoted && userChoice === option._id.toString()) ||
                      (currentProject.creator._id === currentUser._id &&
                        highestVote === option._id)
                        ? "votedCard"
                        : ""
                    }`}
                  >
                    {option.image && (
                      <div className="optionImage">
                        <img src={option.image} alt={option.title} />
                      </div>
                    )}

                    {option.image && (
                      <div
                        className="searchIcon cursorPointer"
                        onClick={() => {
                          handleImageFocus(option.image);
                        }}
                      >
                        <img src={searchIcon} />
                      </div>
                    )}
                    <div className="optionInfoBox">
                      <h4 className="title">{option.title}</h4>
                      <p className="body secondaryColor">
                        {option.description}
                      </p>
                      <div className="spacer"></div>
                      <div className="detailPageButtons">
                        {user && user.role === "fans" && (
                          <button
                            className={`button buttonPrimarySmall buttonFont buttonFontReverse ${
                              isVotingClosed
                                ? "button buttonClosedSmall buttonFont buttonFontReverse"
                                : hasVoted ||
                                  new Date(currentProject.startDate) >
                                    new Date()
                                ? "button buttonFont buttonFontReverse buttenNoDrop"
                                : ""
                            }`}
                            onClick={
                              hasVoted ||
                              isVotingClosed ||
                              new Date(currentProject.startDate) > new Date()
                                ? null
                                : () => handleVoteClick(option)
                            }
                            disabled={
                              hasVoted ||
                              isVotingClosed ||
                              new Date(currentProject.startDate) > new Date()
                            }
                          >
                            {hasVoted ? (
                              userChoice === option._id.toString() ? (
                                <div className="votedButtonAlign">
                                  <img src={checkIcon} alt="Check icon" />
                                  You voted this
                                </div>
                              ) : null
                            ) : isVotingClosed ? (
                              "Voting Closed"
                            ) : new Date(currentProject.startDate) >
                              new Date() ? (
                              "Voting not started"
                            ) : (
                              "Vote this!"
                            )}
                          </button>
                        )}
                        {currentProject.creator._id === currentUser._id && (
                          <div>
                            <p className="label secondaryColor">results:</p>

                            {option.counter === 0 ? (
                              <p className="sectionTitle">No Votes</p>
                            ) : option.counter === 1 ? (
                              <p className="sectionTitle">
                                {option.counter} Vote
                              </p>
                            ) : (
                              <p className="sectionTitle">
                                {option.counter} Votes
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No options available for this project.</p>
              )}
            </div>
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
              <h3 className="title">Delete Project</h3>
              <p className="body">Are you sure to delete your project?</p>
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
                className="button buttonPrimaryLarge submitButton buttonFont"
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
          <div className="submitModal bigImageModel">
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
