import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function AllCreatorsPage() {
  const [allCreators, setAllCreators] = useState([]);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const getAllCreators = () => {
    axios
      .get(`${API_URL}/api/creators`)
      .then((response) => {
        setAllCreators(response.data);
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

  return (
    <div style={styles.container}>
      {errorMessage && <p>{errorMessage}</p>}
      {allCreators &&
        allCreators.map((creator) => (
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
  );
}

const styles = {
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
