import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_USER_FORM_VALUES = {
  name: "",
  image: "",
  description: "",
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
    <div style={{ padding: "20px" }}>
      <h1>Edit Profile</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            style={{ marginLeft: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formValues.image}
            onChange={handleInputChange}
            style={{ marginLeft: "8px" }}
          />
        </div>
        {user.role === "creators" && (
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontFamily: "sans-serif",
                minHeight: "100px",
                marginLeft: "8px",
              }}
            />
          </div>
        )}
        <div style={{ marginBottom: "16px" }}>
          <label>Social Media Links:</label>
          {formValues.socialMedia.map((link, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <input
                type="text"
                value={link}
                onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                style={{ marginRight: "8px" }}
              />
              <button
                type="button"
                onClick={() => handleRemoveSocialMedia(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSocialMedia}>
            Add Social Media Link
          </button>
        </div>
        <button type="submit" style={{ marginTop: "16px" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default ProfileEditPage;
