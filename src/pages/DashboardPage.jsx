import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import "../components/Dashboard.css";

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
    <div className="containerDashboardPage">
      {currentUser.role === "creators" ? (
        <div>
          <div className="headerContainer">
            <h1>My Projects</h1>
            <Link to="/projects/create">
              <button className="button buttonLarge">
                + Create New Project
              </button>
            </Link>
          </div>
          <div>
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
                      <div>
                        {project.image && (
                          <img src={project.image} alt={project.title} />
                        )}
                        <h2>{project.title}</h2>
                        <p className="projectDescription">
                          {project.description}
                        </p>
                        <div className="optionContainer">
                          <p className="optionHeadline">RESULTS:</p>
                          {project.options.map((option) => (
                            <div
                              className={`optionbox ${
                                option.counter === maxCounter
                                  ? "highestOption"
                                  : ""
                              }`}
                              key={option._id}
                            >
                              <p>{option.title}</p>
                              <p>{option.counter}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="noProjectsMessage">No projects found.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="headerContainer">
            <h1>My Votes</h1>
          </div>

          <div className="projectsContainer">
            {fan.votes && fan.votes.length > 0 ? (
              fan.votes.map((vote) => (
                <div key={vote._id} className="projectCard">
                  {vote.image && <img src={vote.image} alt={vote.title} />}
                  <h2>{vote.title}</h2>
                  <p className="projectDescription">{vote.description}</p>
                  <p className="optionHeadline">
                    Total Votes for this option: {vote.counter}
                  </p>
                </div>
              ))
            ) : (
              <p className="noProjectsMessage">No votes found.</p>
            )}
          </div>
          <div className="headerContainer">
            <h1>Followed Creators</h1>
          </div>
          <div className="projectsContainer">
            {fan.favoritCreators && fan.favoritCreators.length > 0 ? (
              fan.favoritCreators.map((creator) => (
                <Link
                  to={`/creators/${creator._id}`}
                  key={creator._id}
                  className="favCreatorCard"
                ><img src={creator.image} alt={creator.name} />
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
      )}
    </div>
  );
}

export default DashboardPage;
