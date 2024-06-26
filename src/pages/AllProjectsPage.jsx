import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/AllProjectsPage.css";
import "../components/Skeleton.css";
import CreatorCard from "../components/CreatorCard";
import defaultImage from "../assets/images/Avatar.svg";

const API_URL = import.meta.env.VITE_API_URL;

function AllProjectsPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getAllProjects = () => {
    axios
      .get(`${API_URL}/api/projects`)
      .then((response) => {
        setAllProjects(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorDescription =
          error.response?.data?.message || "An error occurred";
        setErrorMessage(errorDescription);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="allProjectsContainer">
      {errorMessage && <p>{errorMessage}</p>}
      {allProjects.map((project) =>
        isLoading ? (
          <div className="skeleton skeletonProjects" key={project._id}></div>
        ) : (
          <Link
            to={`/projects/${project.creator._id}/${project._id}`}
            className="allProjectsCard"
            key={project._id}
          >
            <div className="creatorInfoBox">
              <div className="creatorBoxAllProjects">
                {project.creator.image && (
                  <div>
                    <img
                      src={project.creator.image || defaultImage}
                      alt={`${project.title}'s profile`}
                    />
                  </div>
                )}
                <p>
                  <span className="boldName">{project.creator.name}</span> asks
                  for your opinion on:
                </p>
              </div>
              <h2 className="title">{project.title}</h2>
            </div>
          </Link>
        )
      )}
    </div>
  );
}

export default AllProjectsPage;
