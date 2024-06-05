import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/AllCreatorsPage.css"; // Import the CSS file
import defaultImage from "../assets/images/Avatar.svg";

const API_URL = import.meta.env.VITE_API_URL;

function AllCreatorsPage() {
  const [allCreators, setAllCreators] = useState([]);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [selectedCategory, setSelectedCategory] = useState("");

  const getAllCreators = () => {
    axios
      .get(`${API_URL}/api/creators`)
      .then((response) => {
        setAllCreators(response.data);
        setFilteredCreators(response.data); // Initially, show all creators
      })
      .catch((error) => {
        const errorDescription =
          error.response?.data?.message || "An error occurred";
        setErrorMessage(errorDescription);
      });
  };

  useEffect(() => {
    getAllCreators();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = allCreators.filter(
        (creator) => creator.category === selectedCategory
      );
      setFilteredCreators(filtered);
    } else {
      setFilteredCreators(allCreators);
    }
  }, [selectedCategory, allCreators]);

  return (
    <div className="allCreatorPage">
      {errorMessage && <p>{errorMessage}</p>}

      <div className="filterContainer">
        <label htmlFor="category" className="labelCategory">
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select"
        >
          <option value="">All</option>
          {[
            "Music",
            "Sports",
            "Art",
            "Gaming",
            "Beauty",
            "Culinary",
            "Travel",
            "Fitness",
            "Film & Video",
            "Audio & Podcasts",
          ].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="allCreatorContainer">
        {filteredCreators.map((creator) => (
          <Link
            to={`/creators/${creator._id}`}
            className="allCreatorCard"
            key={creator._id}
          >
            <div className="creatorCardInfo">
              <img
                src={creator.image || defaultImage}
                alt={`${creator.name}'s profile`}
              />
              <div>
                <h2 className="title primaryColor">{creator.name}</h2>
                <p className="body secondaryColor">
                  Follower: {creator.fans.length}
                </p>
                <p className="body secondaryColor">
                  Total Polls: {creator.projects.length}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllCreatorsPage;
