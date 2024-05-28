import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_USER_FORM_VALUES = {
  name: "",
  image: "",
  description: "",
  category: "", // Add category to the default form values
  socialMedia: [""],
};

function ProfileEditPage() {
  const [formValues, setFormValues] = useState(DEFAULT_USER_FORM_VALUES);
  const { user, authenticateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `${API_URL}/api/${user.role}/${user._id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setFormValues({
        name: response.data.name || "",
        image: response.data.image || "",
        description: response.data.description || "",
        category: response.data.category || "", // Fetch category from response
        socialMedia:
          response.data.socialMedia && response.data.socialMedia.length
            ? response.data.socialMedia
            : [""],
      });
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (index, value) => {
    const newSocialMedia = [...formValues.socialMedia];
    newSocialMedia[index] = value;
    setFormValues((prevValues) => ({
      ...prevValues,
      socialMedia: newSocialMedia,
    }));
  };

  const handleAddSocialMedia = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      socialMedia: [...prevValues.socialMedia, ""],
    }));
  };

  const handleRemoveSocialMedia = (index) => {
    const newSocialMedia = formValues.socialMedia.filter((_, i) => i !== index);
    setFormValues((prevValues) => ({
      ...prevValues,
      socialMedia: newSocialMedia,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("authToken");

    try {
      await axios.put(`${API_URL}/api/${user.role}/${user._id}`, formValues, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      await authenticateUser(); // Update user context
      await fetchUserData(); // Fetch updated user data
      navigate("/profile");
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "An error occurred";
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h1>Edit Profile</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formValues.image}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        {user.role === "creators" && (
          <>
            <div style={styles.formGroup}>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                style={{ ...styles.input, ...styles.textarea }}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="category">What's your niche?</label>
              <select
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="" disabled>
                  Choose category
                </option>
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
          </>
        )}
        <div style={styles.formGroup}>
          <label>Social Media Links:</label>
          {formValues.socialMedia.map((link, index) => (
            <div key={index} style={styles.socialMediaGroup}>
              <input
                type="text"
                value={link}
                onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                style={{ ...styles.input, marginRight: "8px" }}
              />
              <button
                type="button"
                onClick={() => handleRemoveSocialMedia(index)}
                style={styles.button}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSocialMedia}
            style={{ ...styles.button, marginTop: "8px" }}
          >
            Add Social Media Link
          </button>
        </div>
        <button type="submit" style={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

const styles = {
  formContainer: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formGroup: {
    marginBottom: "16px",
    width: "100%",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "calc(100% - 16px)",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    minHeight: "100px",
    resize: "vertical",
  },
  socialMediaGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#f5f5f5",
  },
  submitButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "600",
    marginTop: "16px",
  },
};

export default ProfileEditPage;
