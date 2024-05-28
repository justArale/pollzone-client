import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    <div>
      {errorMessage && <p>{errorMessage}</p>}

      <div style={styles.filterContainer}>
        <label htmlFor="category" style={styles.label}>
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
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

      <div style={styles.container}>
        {filteredCreators.map((creator) => (
          <Link
            to={`/creators/${creator._id}`}
            style={styles.link}
            key={creator._id}
          >
            <div style={styles.creatorCard}>
              {creator.image ? (
                <img
                  src={creator.image}
                  alt={`${creator.name}'s profile`}
                  style={styles.image}
                />
              ) : (
                <div style={styles.placeholderImage}>No Image Available</div>
              )}
              <h1 style={styles.name}>{creator.name}</h1>
              <p style={styles.followers}>Followers: {creator.fans.length}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  filterContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "20px",
  },
  label: {
    marginRight: "10px",
    fontWeight: "bold",
  },
  select: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "16px",
    marginTop: "20px",
  },
  creatorCard: {
    border: "1px solid #ccc",
    padding: "16px",
    margin: "16px",
    borderRadius: "8px",
    textAlign: "center",
    width: "200px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 auto 16px",
  },
  placeholderImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    margin: "0 auto 16px",
    fontSize: "12px",
    textAlign: "center",
  },
  name: {
    fontSize: "1.2rem",
    marginTop: "10px",
  },
  followers: {
    fontSize: "1rem",
    color: "#777",
  },
  link: {
    textDecoration: "none", // Removed link decoration
    color: "inherit", // Inherit color
  },
};

export default AllCreatorsPage;
