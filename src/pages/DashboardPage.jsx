import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import "../components/Dashboard.css";
import addIcon from "../assets/icons/add.svg";

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
      // console.log("projectsInfo", projects);
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
      // console.log(response.data);
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
    <div>
      {currentUser.role === "creators" ? (
        <div className="containerDashboardPage">
          <div className="headerContainer">
            <h1 className="pageTitle">My Projects</h1>
            <Link to="/projects/create" className="noUnderline">
              <button className="button buttonPrimaryLarge buttonFont buttonFontReverse">
                <img src={addIcon} alt="addIcon" /> Create New Project
              </button>
            </Link>
          </div>

          <div className="projectsContainer">
            {projects.length > 0 ? (
              projects.map((project) => {
                const maxCounter = Math.max(
                  ...project.options.map((option) => option.counter)
                );
                return (
                  <Link
                    key={project._id}
                    to={`/projects/${project.creator}/${project._id}`}
                    className="projectCard"
                  >
                    <h2 className="title primaryColor">{project.title}</h2>
                    <p className="body secondaryColor">{project.description}</p>
                    <div></div>
                    <div className="optionContainer">
                      <p className="label secondaryColor">results:</p>
                      {project.options.map((option) => (
                        <div
                          className={`optionbox ${
                            option.counter > 0 && option.counter === maxCounter
                              ? "highestOption"
                              : ""
                          }`}
                          key={option._id}
                        >
                          <p className="body">{option.title}</p>
                          <p className="body">{option.counter}</p>
                        </div>
                      ))}
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="noProjectsMessage">No projects found.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="dashboardPageWrapper">
          <div className="containerDashboardPage ">
            <h1 className="pageTitle">My Votes</h1>

            <div className="projectsContainer">
              {fan.votes && fan.votes.length > 0 ? (
                fan.votes.map((vote) => (
                  <Link
                    key={vote._id}
                    className="projectCard"
                    to={`/projects/${vote.projectId.creator._id}/${vote.projectId._id}`}
                  >
                    <h2 className="title primaryColor">{vote.title}</h2>
                    <p className="body secondaryColor">{vote.description}</p>
                    <div></div>
                    <div className="fanVotedContainer">
                      <p className="label secondaryColor">results: </p>
                      <p className="sectionTitle primaryColor">
                        {vote.counter}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="noProjectsMessage">No votes found.</p>
              )}
            </div>
          </div>
          <div className="containerDashboardPage ">
            <h1 className="pageTitle">Followed Creators</h1>

            <div className="projectsContainer">
              {fan.favoritCreators && fan.favoritCreators.length > 0 ? (
                fan.favoritCreators.map((creator) => (
                  <Link
                    to={`/creators/${creator._id}`}
                    key={creator._id}
                    className="favCreatorCard"
                  >
                    <img src={creator.image} alt={creator.name} />
                    <div>
                      <h2>{creator.name}</h2>
                      <p>Follower: {creator.fans.length}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="noProjectsMessage">No favorite creators found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
